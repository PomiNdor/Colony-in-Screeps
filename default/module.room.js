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

var moduleFunctions = require('module.functions');

const rootRooms = [
    {
        name: 'E2S17', 
        miningRooms: ['E1S17', 'E2S18', 'E1S16', 'E1S18'], // 'E1S18'
        NoSearchedRooms: [],
        
        
        creeps: {
            restPoint: {x: 16, y: 40},
            transporters_countMax: 2,
            transporterParts: [...(new Array(10).fill(CARRY)), ...(new Array(10).fill(MOVE))],
            
            harvesters_countMax: 0,
            harvesterParts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            upgraders_countMax: 0,
            upgraderParts: [WORK, WORK, WORK, WORK,  CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            builders_countMax: 1,
            builderParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            
            carrierParts: [...(new Array(15).fill(CARRY)), ...(new Array(15).fill(MOVE))],
            minerParts: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            
            carriUpgraders_countMax: 4,
            carriUpgraderParts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, 
                                 MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        },
        towers: {
            minEnergy: 800,
            maxRepairHits: 100000
        }
        
    },
    { 
        name: 'E4S17', 
        miningRooms: ['E3S17'], //['E4S18', 'E3S18', 'E3S17'],
        NoSearchedRooms: [],
        
        creeps: { 
            restPoint: {x: 30, y: 8},
            transporters_countMax: 1,
            transporterParts: [...(new Array(15).fill(CARRY)), ...(new Array(15).fill(MOVE))],
            // 1800
            harvesters_countMax: 1,
            harvesterParts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            upgraders_countMax: 1,
            upgraderParts: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, 
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,  MOVE,  MOVE,  MOVE,  MOVE],
            builders_countMax: 1,
            builderParts: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            
            carrierParts: [...(new Array(15).fill(CARRY)), ...(new Array(15).fill(MOVE))],
            minerParts: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            
            carriUpgraders_countMax: 1,
            carriUpgraderParts: [...(new Array(8).fill(WORK)), ...(new Array(6).fill(CARRY)), ...(new Array(14).fill(MOVE))]
        },
        towers: {
            minEnergy: 800,
            maxRepairHits: 20000
        }
    }
]


var moduleVisualize = require('module.visualize');

function setRootRoomsConstants() {
    Memory.rootRooms = rootRooms;
    for (let i in Memory.rootRooms) {
        let rootRoom = Memory.rootRooms[i];
       
        let miners = 0;
        let carriers = 0;
        let SetRoomConstants = function(roomName) {
            
            let memoryRoom = Memory.rooms[roomName];
            
            if (memoryRoom && memoryRoom.resources) {
                let countMineRes = _.filter(Memory.rooms[roomName].resources, res => res.status == 'mine').length;
                miners += countMineRes;
                if (roomName != rootRoom.name)
                    carriers += countMineRes;
            }
                
                
            // Если к комнате привязаны грузчики, привязаны ли к грузчикам комнаты
            if (memoryRoom && memoryRoom.carriers) {
                for (let i in memoryRoom.carriers) {
                    let carryCreep = Game.creeps[memoryRoom.carriers[i]];
                    if (!carryCreep || carryCreep.memory.targetRoom != roomName) {
                        // console.log('Удаляю ', memoryRoom.carriers[i], ' ', carryCreep);
                        memoryRoom.carriers.splice(i, 1);
                    }
                }
            }
            
            // Подсчет ресов в комнате
            var room = Game.rooms[roomName];
            let roomCountRes = 0;
            if (room) {
                _.forEach(room.find(FIND_DROPPED_RESOURCES), dropped_res => {
                    roomCountRes += dropped_res.amount;
                });
                _.forEach(room.find(FIND_STRUCTURES, {filter: struct => struct.structureType == 'container'}), container => {
                    roomCountRes += container.store[RESOURCE_ENERGY];
                });
                
                room.memory.countResEnergy = roomCountRes;
            }
        }
        
        SetRoomConstants(rootRoom.name);
        _.forEach(rootRoom.miningRooms, miningRoom => SetRoomConstants(miningRoom));
        
        rootRoom.creeps.miners_countMax = miners;
        rootRoom.creeps.carriers_countMax = carriers + Math.floor(carriers / 2);
        
    };
    
    
    
}

var moduleRoom = {
    run: function() {
        setRootRoomsConstants();
        
        for (let i in Memory.rootRooms) {
            let rootRoom = Memory.rootRooms[i];
            if (Memory.rooms && Memory.rooms[rootRoom.name]) {
                this.actualize(rootRoom.name);
                this.visualize(rootRoom.name);
            }
            
            rootRoom.miningRooms.forEach(nameRoom => {
                //moduleRoom.refresh(Game.rooms[nameRoom], 'f7e936eb12ab2716ef044d2f');
                
                SetSettings(nameRoom); // room - Memory.rooms[name]
                if (Memory.rooms && Memory.rooms[nameRoom]) {
                    this.actualize(nameRoom);
                    this.visualize(nameRoom);
                }
            });
        }
    },
    
    refresh: function(room, resourceId = '') { RefreshSettings(room, resourceId) },
    
    // Визуализация данных в комнате
    visualize: function(nameRoom) {
        let gameRoom = Game.rooms[nameRoom];
        if (gameRoom) {
            let tableInfoPos = {x: 1, y: 1};
            let tableInfoStyle = { align: 'left', opacity: 0.7, color: 'SpringGreen'};
            // Отрисовка ресурсов комнаты
            if (gameRoom.storage) {
                let storageText = ['Storage: '];
                for (let i in gameRoom.storage.store)
                    storageText.push((i == 'energy' ? 'E' : i) + ' ' + gameRoom.storage.store[i]);

                moduleVisualize.table(gameRoom, storageText, tableInfoPos, 
                    {fill: "#212121", opacity: tableInfoStyle.opacity}, 
                    tableInfoStyle);
            }


            if (!gameRoom.memory.resources) SetSettings(nameRoom);
            
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
        let gameRoom = Game.rooms[nameRoom];
        if (memoryRoom && memoryRoom.resources) {
            memoryRoom.resources.forEach(res => {
                
                if (res.type != 'energy' && gameRoom) {
                    let mineral = Game.getObjectById(res.id);
                    if (mineral)
                        res.amount = mineral.mineralAmount;
                    
                    let extractors = _.filter(gameRoom.lookForAt(LOOK_STRUCTURES, res.pos.x, res.pos.y),
                                                struct => struct.structureType == STRUCTURE_EXTRACTOR);
                    //console.log(extractors, res.pos.x, res.pos.y);
                    res.status = res.amount > 0 && extractors.length && IsNearTo(extractors[0], res) ? 'mine' : 'notMine';
                    res.updateDate = Game.time;
                }

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
                    
                }
            });
        }
        
        
        
    }
}



function SetSettings(nameRoom) {
    if (!Memory.rooms || !Memory.rooms[nameRoom] || !Memory.rooms[nameRoom].resources) {
        
        let rootRoom = moduleFunctions.FindRootRoomMemory(nameRoom);
        // // Удаление delete Memory.rooms
        let gameRoom = Game.rooms[nameRoom];
        let memoryRoom = Memory.rooms[nameRoom];
        if (rootRoom) {
            if (!gameRoom) {
                if (!rootRoom.NoSearchedRooms)
                    rootRoom.NoSearchedRooms = [];
                if (!_.find(rootRoom.NoSearchedRooms, room => room.name == nameRoom))
                    rootRoom.NoSearchedRooms.push(({name: nameRoom, creepId: '' }));
            } else {
                // Удаление из памяти не исследованных комнат
                _.forEach(Memory.NoSearchedRooms, (room, index) => {
                    if (room.name == nameRoom)
                        Memory.NoSearchedRooms.splice(index, 1);
                });
            }
            
        } else {
            console.log('module.room', 'if (rootRoom)', rootRoom);
        }
        
        
        if (gameRoom && rootRoom) {
            
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
                // ------------------------------------- ДОБАВИЛ ЭТО
                gameRoom.find(FIND_MINERALS).forEach(mineral => {
                    
                    // Удаление ИД у крипов, которые привязанны к этому источнику (возможно при очистке памяти)
                    for (let name in Game.creeps)
                        if (Game.creeps[name].memory.targetId == mineral.id)
                            delete Game.creeps[name].memory.targetId;
                    // -----------
                    
                    // Получение координат рядом стоящих контейнеров
                    let containerPosition = _.map(
                        _.filter(mineral.room.lookForAtArea(LOOK_STRUCTURES, mineral.pos.y-1, mineral.pos.x-1, mineral.pos.y+1, mineral.pos.x+1, true), 
                            struct => struct.structure.structureType == 'container'),
                        struct => { return {x: struct.x, y: struct.y} }
                    );
                    
                    let extractors = _.filter(mineral.room.lookForAt(LOOK_STRUCTURES, mineral), struct => struct.structureType == STRUCTURE_EXTRACTOR);

                    // Запись в память
                    gameRoom.memory.resources.push({
                        id: mineral.id,
                        status: extractors.length && IsNearTo(extractors[0], mineral) ? 'mine' : 'notMine',
                        pos: mineral.pos,
                        containerPos: containerPosition,
                        type: mineral.mineralType,
                        amount: mineral.mineralAmount,
                        creeps: [],
                        updateDate: Game.time
                    });
                });
            }
        }
    }
}

function IsNearTo(object, target) {
    return object.pos.x == target.pos.x && object.pos.y == target.pos.y && object.pos.roomName == target.pos.roomName;
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