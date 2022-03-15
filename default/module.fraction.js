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

var moduleLinks = require('module.links');
var moduleFunctions = require('module.functions');
var moduleVisualize = require('module.visualize');

const FRACTIONS = [   // rootRooms
    {
        roomName: 'W44N1', 
        miningRoomsName: ['W43N1', 'W44N2', 'W45N1'], // 'W44N2', 'W45N1'
        NoSearchedRooms: [],
        mining: true,
        reserving: true,
        reservingMinTick: 2500,
        centerPoint: {x: 37, y: 10},
        
        restPoint: {x: 40, y: 15},
        creeps: {
            'harvester': {
                countMax: 0
            },
            'searcher': {},
            'transporter': {
                countMax: 1
            },
            'miner': {
                countMax: 0
            },
            'carrier': {
                countMax: 0
            },
            'reserver': {
                countMax: 0
            },
            'builder': {
                countMax: 1
            },
            'carriUpgrader': {
                countMax: 1
            },
            'upgrader': {
                countMax: 0
            },
            'dismantle': {
                countMax: 0
            }
        },
        towers: {
            minEnergy: 900,
            maxRepairHits: 200000
        }
        
    },
    {
        roomName: 'W42N4', 
        miningRoomsName: ['W42N3', 'W41N4', 'W41N5'], // 'W43N4'
        NoSearchedRooms: [],
        mining: true,
        reserving: true,
        reservingMinTick: 2500,
        centerPoint: {x: 20, y: 19},
        
        restPoint: {x: 24, y: 21},
        creeps: {
            'harvester': {
                countMax: 1
            },
            'searcher': {},
            'transporter': {
                countMax: 1
            },
            'miner': {
                countMax: 0
            },
            'carrier': {
                countMax: 0
            },
            'reserver': {
                countMax: 0
            },
            'builder': {
                countMax: 1
            },
            'carriUpgrader': {
                countMax: 1
            },
            'upgrader': {
                countMax: 0
            },
            'dismantle': {
                countMax: 0
            }
        },
        towers: {
            minEnergy: 900,
            maxRepairHits: 100000
        }
        
    }
]




// Установка констант: 
// кол-во крипов на роль; 
// подсчет ресов в комнатах (количество едениц)
function setFractionsConstants() {
    Memory.username = 'Pomidor';
    Memory.fractions = FRACTIONS;    // Memory.rootRooms = rootRooms;
    for (let i in Memory.fractions) {
        let fraction = Memory.fractions[i];
       
        let miners = 0;
        let carriers = 0;
        let reservers = 0;
        let searchers = 0;
        let SetRoomConstants = function(roomName) {
            
            let memoryRoom = Memory.rooms[roomName];
            let gameRoom = Game.rooms[roomName];

            // Не исследованные комнаты
            // if (!memoryRoom) {
            //     if (!fraction.NoSearchedRooms)
            //         fraction.NoSearchedRooms = [];
            //     if (!_.find(fraction.NoSearchedRooms, room => room.name == roomName))
            //         fraction.NoSearchedRooms.push(({name: roomName, creepId: '' }));
            // } else {
            //     // Удаление из памяти не исследованных комнат
            //     _.forEach(Memory.NoSearchedRooms, (room, index) => {
            //         if (room.name == roomName)
            //             Memory.NoSearchedRooms.splice(index, 1);
            //     });
            // }
            
            if (fraction.NoSearchedRooms.length > 0)
                searchers = 1;


            // Подсчет кол-ва необходимых майнеров
            if (memoryRoom && memoryRoom.resources && fraction.mining) {
                let countMineRes = _.filter(Memory.rooms[roomName].resources, res => res.status == 'mine' && res.type == 'energy').length;
                miners += countMineRes;
                if (roomName != fraction.roomName)
                    carriers += countMineRes;
            }

            // Нужно ли резервировать комнаты для майна (подсчет резерваторов)
            if (gameRoom && gameRoom.controller && fraction.reserving) {
                let hostile_attack_creeps = gameRoom.find(FIND_HOSTILE_CREEPS, 
                    {filter: creep => creep.body.find(part => part.type == ATTACK || part.type == RANGED_ATTACK)});

                let controller = gameRoom.controller;
                // Если в комнате нет враждебных крипов, и контроллер свободен и резервация меньше минимальной
                if (!hostile_attack_creeps || hostile_attack_creeps.length == 0
                    && !controller.owner && (!controller.reservation || 
                    (controller.reservation.username == Memory.username 
                    && controller.reservation.ticksToEnd < fraction.reservingMinTick)))
                    reservers++;    // Количество резерваторов
            }
            
            
            // Подсчет ресов в комнате
            let roomCountRes = 0;
            if (gameRoom) {
                _.forEach(gameRoom.find(FIND_DROPPED_RESOURCES), dropped_res => {
                    roomCountRes += dropped_res.amount;
                });
                _.forEach(gameRoom.find(FIND_STRUCTURES, {filter: struct => struct.structureType == 'container'}), container => {
                    roomCountRes += container.store[RESOURCE_ENERGY];
                });
                
                gameRoom.memory.countResEnergy = roomCountRes;
            }
        }
        
        SetRoomConstants(fraction.roomName);
        _.forEach(fraction.miningRoomsName, miningRoomName => SetRoomConstants(miningRoomName));
        
        fraction.creeps['miner'].countMax = miners;
        fraction.creeps['reserver'].countMax = reservers;
        fraction.creeps['searcher'].countMax = searchers;
        if (fraction.reserving)
            fraction.creeps['carrier'].countMax = carriers + Math.floor(carriers * 3 / 4);  // carriers * 2
        else
            fraction.creeps['carrier'].countMax = carriers + Math.floor(carriers / 2);
        // console.log(carriers, carriers + Math.round(carriers / 2));
        
    };
    
    
    
}

function CheckingTargetCarriersInRooms() {
    for (var roomName in Memory.rooms) {
        let memoryRoom = Memory.rooms[roomName];
        // console.log(roomName, memoryRoom);
        if (memoryRoom) for (let i in memoryRoom.carriers) {
            let carrier = Game.creeps[memoryRoom.carriers[i]];
            // console.log(memoryRoom.carriers[i], carrier, roomName, memoryRoom);
            if (!carrier || !carrier.memory.targetRoom || carrier.memory.targetRoom != roomName) {
                memoryRoom.carriers.splice(i, 1);
            }
        }
    }
}

function FindLinks(roomName) {
    let gameRoom = Game.rooms[roomName];
    if (!gameRoom) {
        console.log("WARNING FindLinks не найдена комната фракции" + roomName);
        return;
    }
    let LinkInObjectRadius = (linkPos, objectPos, radius = 1) => {
        let x = linkPos.x - objectPos.x;
        let y = linkPos.y - objectPos.y;
        return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
    }

    // console.log(gameRoom.memory.links[0]);
    // Если ранее их небыло вообще
    if (!gameRoom.memory.links || Object.keys(gameRoom.memory.links).length === 0)
        gameRoom.memory.links = {};

    let links = gameRoom.find(FIND_STRUCTURES, 
        { filter: (structure) => structure.structureType == STRUCTURE_LINK });
    if (links.length > 0) {
        for (let i in links) {
            let link = links[i];
            // console.log(link);
            if (LinkInObjectRadius(link.pos, gameRoom.controller.pos)) {
                gameRoom.memory.links['controller'] = { id: link.id };
                // console.log("LINKS Add controller link in room " + roomName);
            } else if (LinkInObjectRadius(link.pos, gameRoom.storage.pos)) {
                gameRoom.memory.links['storage'] = { id: link.id };
                // console.log("LINKS Add storage link in room " + roomName);
            } else {
                if (!gameRoom.memory.links['resource'])
                    gameRoom.memory.links['resource'] = {};
                for (let j in gameRoom.memory.resources) {
                    // console.log(gameRoom.memory.resources[j]);
                    if (LinkInObjectRadius(link.pos, gameRoom.memory.resources[j].pos)) {
                        // console.log(gameRoom.memory.resources[j].id);
                        gameRoom.memory.links['resource'][gameRoom.memory.resources[j].id] = { id: link.id };
                        // console.log("LINKS Add resource link in room " + roomName);
                    }
                }
            }
        }
    }
    // } else {

    // }
    
    
}


var moduleFraction = {
    run: function() {
        setFractionsConstants();
        
        for (let i in Memory.fractions) {
          
            let fraction = Memory.fractions[i];
            SetSettings(fraction.roomName);

            
            if (Memory.rooms && Memory.rooms[fraction.roomName]) {
                this.actualize(fraction.roomName);
                this.visualize(fraction.roomName);

                //  --------- LINKS
                moduleLinks.run(fraction.roomName);
            }
            
            fraction.miningRoomsName.forEach(nameRoom => {
                //moduleRoom.refresh(Game.rooms[nameRoom], 'f7e936eb12ab2716ef044d2f');
                SetSettings(nameRoom); // room - Memory.rooms[name]
                if (Memory.rooms && Memory.rooms[nameRoom]) {
                    this.actualize(nameRoom);
                    this.visualize(nameRoom);
                }
            });
        }
        CheckingTargetCarriersInRooms();
    },
    
    refresh: function(room, resourceId = '') { RefreshSettings(room, resourceId) },
    
    // Визуализация данных в комнате
    visualize: function(nameRoom) {
        let gameRoom = Game.rooms[nameRoom];
        if (gameRoom) {
            let tableInfoPos = {x: 1, y: 1};
            let tableInfoStyle = {font: 0.5, align: 'left', opacity: 0.7, color: 'SpringGreen'};

            // Отрисовка ресурсов комнаты
            if (gameRoom.storage) {
                let storageText = ['Storage: '];
                for (let i in gameRoom.storage.store)
                    storageText.push((i == 'energy' ? 'E' : i) + ' ' + gameRoom.storage.store[i]);

                moduleVisualize.table(gameRoom, storageText, tableInfoPos, 
                    {fill: "#212121", opacity: tableInfoStyle.opacity}, 
                    tableInfoStyle);
            }

            // Отрисовка информации над ресурсами
            if (gameRoom.memory.resources)
            gameRoom.memory.resources.forEach(res => {
                let step = 0.7;
                // Заголовок содержащий кол-во крипов, привязанных к источнику
                gameRoom.visual.text("Creeps: " + res.creeps.length,
                    res.pos.x, res.pos.y - (0.5 + step * res.creeps.length),
                    { font: 0.5, align: 'center', opacity: 0.7 }
                );
                // Вывод имен крипов, привязанных к источнику
                for (let i in res.creeps)
                    gameRoom.visual.text(
                        i + ": " + res.creeps[i].name, 
                        res.pos.x, res.pos.y - (0.5 + step * (res.creeps.length - i - 1)), 
                        { font: 0.5, align: 'center', opacity: 0.7 }
                    );
            });

            // Отрисовка спавнов
            for(var name in Game.spawns) {
                let spawn = Game.spawns[name];
                if (spawn.room.name == nameRoom && spawn.spawning) {
                    let percent = ' (' + Math.floor(100 - spawn.spawning.remainingTime / spawn.spawning.needTime * 100) + '%)';
                    gameRoom.visual.text(spawn.spawning.name + percent, 
                        spawn.pos.x+1, spawn.pos.y+0.25, { font: 0.5, align: 'left'});
                }
            }
        }
    },


    actualize: function(nameRoom) {
        let memoryRoom = Memory.rooms[nameRoom];
        let gameRoom = Game.rooms[nameRoom];
        if (memoryRoom && memoryRoom.resources) {
            if (!memoryRoom.resourcesHarvestCount)
                memoryRoom.resourcesHarvestCount = 0;


            memoryRoom.resources.forEach(res => {
                if (gameRoom) {
                    if (res.type == 'energy') {
                        let resource = Game.getObjectById(res.id);
                        if (resource && resource.ticksToRegeneration == 1)
                            memoryRoom.resourcesHarvestCount += resource.energyCapacity - resource.energy;
                    } else {
                        let mineral = Game.getObjectById(res.id);
                        if (mineral)
                            res.amount = mineral.mineralAmount;
                        
                        let extractors = _.filter(gameRoom.lookForAt(LOOK_STRUCTURES, res.pos.x, res.pos.y),
                                                    struct => struct.structureType == STRUCTURE_EXTRACTOR);
                        //console.log(extractors, res.pos.x, res.pos.y);
                        res.status = res.amount > 0 && extractors.length && IsNearTo(extractors[0], res) ? 'mine' : 'notMine';
                        res.updateDate = Game.time;
                    }
                }

                // console.log(nameRoom, res.id);
                // проверка крипов у ресурсов на существованиe (нужно)
                for (let i in res.creeps) { 
                    let creep = Game.creeps[res.creeps[i].name];
                    // console.log(creep, creep.memory.target, creep.memory.target === undefined);
                    if (creep === undefined || !creep.memory.target || !creep.memory.target.id 
                        || creep.memory.target.id != res.id) {
                        res.creeps.splice(i, 1);
                    }
                }
            });
        }

        if (memoryRoom && memoryRoom.reservers && memoryRoom.reservers.length > 0) {
            if (!Game.creeps[memoryRoom.reservers[0]])
                delete memoryRoom.reservers;
        }
        
        
        
    }
}



function SetSettings(nameRoom) {
    if (!Memory.rooms || !Memory.rooms[nameRoom] || !Memory.rooms[nameRoom].resources) {
        
        let fraction = moduleFunctions.FindFractionMemory(nameRoom);
        // // Удаление delete Memory.rooms
        let gameRoom = Game.rooms[nameRoom];
        if (fraction) {
            if (!gameRoom) {
                if (!fraction.NoSearchedRooms)
                    fraction.NoSearchedRooms = [];
                if (!_.find(fraction.NoSearchedRooms, room => room.name == nameRoom))
                    fraction.NoSearchedRooms.push(({name: nameRoom, creepId: '' }));
            } else {
                // Удаление из памяти не исследованных комнат
                _.forEach(Memory.NoSearchedRooms, (room, index) => {
                    if (room.name == nameRoom)
                        Memory.NoSearchedRooms.splice(index, 1);
                });
            }
            
        } else {
            console.log('module.room', 'if (fraction)', fraction, nameRoom);
        }
        
        
        if (gameRoom && fraction) {
            
            if (!gameRoom.memory.resources) {
                console.log("Добавление новой комнаты в память: " + nameRoom);
                FindResourcesInRoom(gameRoom);
            }
        }
    }
}



// Поиск и добавление в память ресурсов комнаты
function FindResourcesInRoom(gameRoom) {
    ResourcesDeleteTargetCreeps(gameRoom.name);
    gameRoom.memory.resources = [];

    // Ресурсы
    gameRoom.find(FIND_SOURCES).forEach(source => {
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
            amount: source.energy,
            creeps: [],
            updateDate: Game.time
        });
    });

    // Минералы
    gameRoom.find(FIND_MINERALS).forEach(mineral => {
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

// Удалить у крипов привязку к ресурсам (и у ресов к крипам)
function ResourcesDeleteTargetCreeps(nameRoom) {
    let memoryRoom = Memory.rooms[nameRoom];
    if (!memoryRoom || !memoryRoom.resources) return;

    memoryRoom.resources.forEach(res => {
        res.creeps.forEach(creepName => {
            if (Game.creeps[creepName] && Game.creeps[creepName].memory.target 
                && Game.creeps[creepName].memory.target.id == res.id)
                delete Game.creeps[creepName].memory.target;
        });
        delete res.creeps;
    });
}


function IsNearTo(object, target) {
    return object.pos.x == target.pos.x && object.pos.y == target.pos.y && object.pos.roomName == target.pos.roomName;
}


function ObjectToString(obj) {
    let str = "";
    for (let k in obj)
        str += k + ": " + obj[k] + "\n";
    return str;
}

module.exports = moduleFraction;