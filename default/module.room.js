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
    set: function(room) { SetSettings(room); },
    refresh: function(room, resourceId = '') { RefreshSettings(room, resourceId) },
    
    // Визуализация данных в комнате
    visualize: function(room) {
        //let room = Game.rooms[name];
        if (!room.memory.resources) SetSettings(room);
        
        room.memory.resources.forEach(res => {
            let step = 0.7;
            // Заголовок содержащий кол-во крипов, привязанных к источнику
            room.visual.text("Creeps: " + res.creeps.length,
                res.pos.x, res.pos.y - (0.5 + step * res.creeps.length),
                { align: 'center', opacity: 0.7 }
            );
            // Вывод имен крипов, привязанных к источнику
            for (let i in res.creeps)
                room.visual.text(
                    i + ": " + res.creeps[i].name, 
                    res.pos.x, res.pos.y - (0.5 + step * (res.creeps.length - i - 1)), 
                    { align: 'center', opacity: 0.7 }
                );
        });
    }
}

function SetSettings(room) {
    // // Удаление delete Memory.rooms
    //if ()
    if (!room.memory.resources) {
        console.log("Добавление новой комнаты в память: " + room.name);
        room.memory.resources = [];
        
        room.find(FIND_SOURCES).forEach(source => {
            
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
            room.memory.resources.push({
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

function RefreshSettings(room, resourceId = '') {
    if (resourceId) {
        // Можно переделать без двойного поиска ресурсов
        room.find(FIND_SOURCES).forEach(source => {
            if (source.id == resourceId) {
                // Получение координат рядом стоящих контейнеров
                let containerPosition = _.map(
                    _.filter(source.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true), 
                        struct => struct.structure.structureType == 'container'),
                    struct => { return {x: struct.x, y: struct.y} }
                );
                // Запись в память
                
                _.forEach(room.memory.resources, res => {
                    if (res.id == resourceId)
                        res.containerPos = containerPosition;
                });
            }
        });
    } else {
        // ------------- Для всех ресурсов в комнате
    }
}

function ObjectToString(obj) {
    let str = "";
    for (let k in obj)
        str += k + ": " + obj[k] + "\n";
    return str;
}

module.exports = moduleRoom;