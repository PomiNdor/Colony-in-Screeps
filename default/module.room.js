/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.room');
 * mod.thing == 'a thing'; // true
 */


/*
room.memory:
    resources = [{
        id: source.id,
        status: mine        // хз зачем
        pos: source.pos,
        containerPos: []    // хз пока
        type: 'energy',
        creeps: [name1, name2, ...],
        updateTime: Game.time   // хз пока
    }, ...],
*/

var moduleRoom = {
    // room - Memory.rooms[name]
    set: function(nameRoom) { SetSettings(nameRoom); },
    refresh: function(room, resourceId = '') { RefreshSettings(room, resourceId) },
    
    // Визуализация данных в комнате
    visualize: function(nameRoom) {
        let gameRoom = Game.rooms[nameRoom];
        if (gameRoom) {
            //let room = Game.rooms[name];
            if (!gameRoom.memory.resources) SetSettings(room);
            
            gameRoom.memory.resources.forEach(res => {
                let step = 0.7;
                // Заголовок содержащий кол-во крипов, привязанных к источнику
                gameRoom.visual.text("Creeps: " + res.creeps.length,
                    res.pos.x, res.pos.y - (0.5 + step * res.creeps.length),
                    { align: 'center', opacity: 0.7 }
                );
                // Вывод имен крипов, привязанных к источнику
                for (let i in res.creeps)
                    gameRoom.visual.text(
                        i + ": " + res.creeps[i].name, 
                        res.pos.x, res.pos.y - (0.5 + step * (res.creeps.length - i - 1)), 
                        { align: 'center', opacity: 0.7 }
                    );
            });
        }
    },
    actualize: function(nameRoom) {
        let memoryRoom = Memory.rooms[nameRoom];
        if (memoryRoom) {
            memoryRoom.resources.forEach(res => {
                
                for (let i in res.creeps) {
                    // console.log('res.creeps[i].name ', res.creeps[i].name, " ", res.id);
                    // console.log((_.filter(Game.creeps, creep => creep.name == res.creeps[i].name && creep.targetId != res.id)));
                    
                    for (var gameCreepName in Game.creeps) {
                        
                        if (gameCreepName == res.creeps[i].name) {
                            // console.log('gameCreepName == res.creeps[i].name ', gameCreepName);
                            // console.log('Game.creeps[gameCreepName].target.id ', Game.creeps[gameCreepName].memory.target);
                            if (!Game.creeps[gameCreepName].memory.target || Game.creeps[gameCreepName].memory.target.id != res.id){
                                res.creeps.splice(i, 1);
                                break;
                            }
                        }
                    }
                    
                    // if (_.filter(Game.creeps, creep => creep.name == res.creeps[i].name && creep.targetId != res.id) )
                    //     res.creeps.splice(i, 1);
                }
            });
        }
        
        
        
        // Проверка если у крипа есть цель, есть ли у цели крип?
        // if (creep.memory.target) {
        //     let finded = false;
        //     for (let i in roomNames) {
        //         if (!creep.memory.target) break;
                
        //         roomName = roomNames[i];
        //         let memoryRoom = Memory.rooms[roomName];
        //         if (memoryRoom) {
        //             let res = _.find(memoryRoom.resources, item => item.id == creep.memory.target.id);
                
        //             if (res && _.find(res.creeps, resCrep => resCrep.name == creep.name))
        //                 finded = true;
        //         }
        //     }
        //     // roomNames.forEach(roomName => { });
        //     if (!finded) {
        //         delete creep.memory.target;
        //         delete creep.memory.constructionContainer;
        //         delete creep.memory.building;
        //         delete creep.memory.container;
        //     }
        // }
    }
}
function SetSettings(nameRoom) {
    if (!Memory.rooms || !Memory.rooms[nameRoom] || !Memory.rooms[nameRoom].resources) {
        
        // // Удаление delete Memory.rooms
        let gameRoom = Game.rooms[nameRoom];
        if (!gameRoom) {
            if (!Memory.NoSearchedRooms)
                Memory.NoSearchedRooms = [];
            if (!_.find(Memory.NoSearchedRooms, room => room.name == nameRoom))
                Memory.NoSearchedRooms.push(({name: nameRoom, creepId: '' }));
        }
        else {
            
            // Удаление из памяти не исследованных комнат
            _.forEach(Memory.NoSearchedRooms, (room, index) => {
                if (room.name == nameRoom)
                    Memory.NoSearchedRooms.splice(index, 1);
            });
            
            
            if (!gameRoom.memory.resources) {
                console.log("Добавление новой комнаты в память: " + nameRoom);
                gameRoom.memory.resources = [];
                
                gameRoom.find(FIND_SOURCES).forEach(source => {
                    
                    // Удаление ИД у крипов, которые привязанны к этому источнику (возможно при очистке памяти)
                    for (let name in Game.creeps)
                        if (Game.creeps[name].memory.targetId == source.id)
                            delete Game.creeps[name].memory.targetId;
                    // -----------
                    
                    // Получение координат рядом стоящих контейнеров
                    let containerPosition = _.map(
                        _.filter(source.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true), 
                            struct => struct.structure.structureType == 'container'),
                        struct => { return {x: struct.x, y: struct.y} }
                    );
                    // Запись в память
                    gameRoom.memory.resources.push({
                        id: source.id,
                        status: 'mine',
                        pos: source.pos,
                        containerPos: containerPosition,
                        type: 'energy',
                        creeps: [],
                        updateDate: Game.time
                    });
                });
            }
        }
    }
}

function RefreshSettings(nameRoom, resourceId = '') {
    // if (resourceId) {
    //     // Можно переделать без двойного поиска ресурсов
    //     room.find(FIND_SOURCES).forEach(source => {
    //         if (source.id == resourceId) {
    //             // Получение координат рядом стоящих контейнеров
    //             let containerPosition = _.map(
    //                 _.filter(source.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true), 
    //                     struct => struct.structure.structureType == 'container'),
    //                 struct => { return {x: struct.x, y: struct.y} }
    //             );
    //             // Запись в память
                
    //             _.forEach(room.memory.resources, res => {
    //                 if (res.id == resourceId)
    //                     res.containerPos = containerPosition;
    //             });
    //         }
    //     });
    // } else {
    //     // ------------- Для всех ресурсов в комнате
    // }
}

function ObjectToString(obj) {
    let str = "";
    for (let k in obj)
        str += k + ": " + obj[k] + "\n";
    return str;
}

module.exports = moduleRoom;