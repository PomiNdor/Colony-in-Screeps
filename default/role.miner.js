/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */
let moduleFunctions = require('module.functions');

function FindMinRangeResources(creep, resources) {
    let minRes = resources[0];
    let minRange = creep.pos.getRangeTo(Game.getObjectById(minRes.id));
    _.forEach(resources, res => {
        let range = creep.pos.getRangeTo(Game.getObjectById(res.id));
        if (range < minRange) {
            minRes = res;
            minRange = range;
        }
    });
    return minRes;
}

function FindResources(creep) {
    const fraction = moduleFunctions.FindFractionMemory(creep.memory.fractionRoom);
    // Перебираем все комнаты и их точки ресурсов
    // for (var roomName in Memory.rooms) 
    let miningRooms = [fraction.roomName, ...fraction.miningRoomsName];
    for (var i in miningRooms) {
        let roomName = miningRooms[i];
        let memoryRoom = Memory.rooms[roomName];
        if (!memoryRoom) continue;

        let resources = _.filter(memoryRoom.resources, item => !(_.find(item.creeps, creep => creep.role == 'miner')) && item.status == 'mine' && item.type == 'energy');
        
        // console.log(roomName, resources);
        if (resources.length > 0) {
            // console.log('2',resources[0].id);
            let res = FindMinRangeResources(creep, resources);
            if (!creep.memory.target) creep.memory.target = {};
            creep.memory.target.id = res.id;
            creep.memory.target.roomName = roomName;
            res.creeps.push(({name: creep.name, role: creep.memory.role}));
            break;
        }
    }

}

// Проверка если у крипа есть цель, есть ли у цели крип?
function CheckingTarget(creep) {
    for (var roomName in Memory.rooms) {
        if (!creep.memory.target) break;
        let memoryRoom = Memory.rooms[roomName];
        let res = _.find(memoryRoom.resources, item => item.id == creep.memory.target.id);
        if (res) {
            if (!(_.find(res.creeps, resCreep => resCreep.name == creep.name))) {
                delete creep.memory.target;
                break;
            }
        }
    }
}


var roleMiner = {
    run: function(creep) {
        if (creep.memory.target)
            CheckingTarget(creep);
        // Если нет цели (может пропасть в верхнем условии)
        if (!creep.memory.target || creep.memory.target === undefined) {
            // console.log('FindResources');
            creep.memory.mining = false;
            FindResources(creep);
        } 
        
        if (!creep.memory.target) {
            creep.say("Нет цели!");
            return;
        } else if (creep.room.name != creep.memory.target.roomName) {
            let route = Game.map.findRoute(creep.room, creep.memory.target.roomName);
            if(route && route.length > 0) {
                let exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        


        
        if (creep.spawning) return;
        // Если не дошел до цели и пока не копает
        else if (!creep.memory.mining) {
            // Получаем объект
            let target = Game.getObjectById(creep.memory.target.id);
            if (!target) {
                delete creep.memory.target;
                return;
            }
            // Если не в радиусе одной клетки, то движемся к цели
            if (!creep.InObjectRadius(target))
                creep.moveTo(target, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            else
                FindOrBuildStorage(creep, target);
        } else if (creep.memory.mining) {
            let target = Game.getObjectById(creep.memory.target.id);
            if (creep.memory.container) {
                delete creep.memory.constructionContainer;
                let container = Game.getObjectById(creep.memory.container);
                if (!container) delete creep.memory.container;
                else if (container.hits < container.hitsMax / 2)
                    creep.repair(container);
            }
            else if (!creep.memory.constructionContainer) {
                FindOrBuildStorage(creep, target);
            }
            if (creep.memory.constructionContainer) {
                if (creep.store.getFreeCapacity() <= 10) {
                    let constructionContainer = Game.getObjectById(creep.memory.constructionContainer);
                    if (!constructionContainer) {
                        FindOrBuildStorage(creep, target);
                    } else if (!constructionContainer.hits) {
                        creep.build(constructionContainer);
                    } else {
                        creep.memory.container = creep.memory.constructionContainer;
                        delete creep.memory.constructionContainer;
                        delete creep.memory.building;
                    }
                }
                creep.harvest(target); // можно оптимизировать метод getObjectById()
            } else {
                creep.harvest(target); // можно оптимизировать метод getObjectById()

                // -------------------- LINKS
                let memoryRoom = Memory.rooms[creep.room.name];
                if (memoryRoom && memoryRoom.links && memoryRoom.links.resource && memoryRoom.links.resource[creep.memory.target.id]) {
                    let link = Game.getObjectById(memoryRoom.links.resource[creep.memory.target.id].id);
                    if (link) creep.transfer(link, RESOURCE_ENERGY);
                }
            }
        }
        
        
    } 
}
// target - ресурс, около которого должен быть контейнер
function FindOrBuildStorage(creep, target) {
    // -------------------------- жрет много CPU
    let structuresContainer = _.filter(
        creep.room.lookForAtArea(LOOK_STRUCTURES, target.pos.y-1, target.pos.x-1, target.pos.y+1, target.pos.x+1, true),
        struct => struct.structure.structureType == 'container');
    // Если есть контейнер
    if (structuresContainer.length > 0) {
        
        creep.memory.container = structuresContainer[0].structure.id;
        if (structuresContainer[0].x == creep.pos.x && structuresContainer[0].y == creep.pos.y) {
            creep.say("У 1📦️!");
            creep.memory.mining = true;
        } else {
            creep.say("Иду к 1📦️");
            creep.moveTo(structuresContainer[0].x, structuresContainer[0].y);
        }
    } else {
        let constructionSiteContainer = _.filter(
            creep.room.lookForAtArea(LOOK_CONSTRUCTION_SITES, target.pos.y-1, target.pos.x-1, target.pos.y+1, target.pos.x+1, true),
            struct => struct.constructionSite.structureType == 'container');
            Memory.test = constructionSiteContainer;
        if (constructionSiteContainer.length > 0) {
            creep.memory.constructionContainer = constructionSiteContainer[0].constructionSite.id;
            if (constructionSiteContainer[0].x == creep.pos.x && constructionSiteContainer[0].y == creep.pos.y) {
                creep.say("У 📦⚒️!");
                creep.memory.mining = true;
            } else {
                creep.say("Иду к 📦⚒️");
                creep.moveTo(constructionSiteContainer[0].x, constructionSiteContainer[0].y);
            }
        } else {
            // строит новый
            creep.say("Строим 📦⚒️!");
            creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
            creep.memory.constructionContainer = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos).id;
            creep.memory.mining = true;
        }
    }
}

function FindStructureAtArea(room, x1, y1, x2, y2, structureType) {
    // -------------------------- жрет много CPU
    let structure = _.filter(
        room.lookForAtArea(LOOK_STRUCTURES, x1, y1, x2, y2, true),
        struct => struct.structure.structureType == structureType);
    return structure;
}

module.exports = roleMiner;