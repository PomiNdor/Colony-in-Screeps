/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

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


var roleMiner = {
    run: function(creep) {
        
        // Проверка если у крипа есть цель, есть ли у цели крип?
        if (creep.memory.targetId) {
            for (var roomName in Memory.rooms) {
                if (!creep.memory.targetId) break;
                let room = Memory.rooms[roomName];
                let res = _.find(room.resources, item => item.id == creep.memory.targetId);
                
                if (res) {
                    if (!(_.find(res.creeps, resCrep => resCrep.name == creep.name))) {
                        delete creep.memory.targetId;
                        break;
                    }
                }
            }
        }
        
        
        // Если нет цели
        if (!creep.memory.targetId) {
            creep.memory.mining = false;
            // Перебираем все комнаты и их точки ресурсов
            for (var roomName in Memory.rooms) {
                if (creep.memory.targetId) break;
                let room = Memory.rooms[roomName];
                
                let resources = _.filter(room.resources, item => !(_.find(item.creeps, creep => creep.role == 'miner')));
                if (resources) {
                    let res = FindMinRangeResources(creep, resources);
                    creep.memory.targetId = res.id;
                    res.creeps.push(({name: creep.name, role: creep.memory.role}));
                    break;
                }
            }
        } 
        
        
        // Если не дошел до цели и пока не копает
        if (!creep.memory.mining && creep.memory.targetId) {
            // Получаем объект
            let target = Game.getObjectById(creep.memory.targetId);
            // Если не в радиусе одной клетки, то движемся к цели
            if (!CreepInObjectRadius(creep, target)) // creep.harvest(target) == ERR_NOT_IN_RANGE
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            else
                FindOrBuildStorage(creep, target);
        }
        
        if (creep.memory.mining) {
            if (creep.memory.constructionContainer) {
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                    creep.memory.building = true;
                if (creep.store[RESOURCE_ENERGY] == 0)
                    creep.memory.building = false;
                    
                if (creep.memory.building) {
                    let constructionContainer = Game.getObjectById(creep.memory.constructionContainer);
                
                    if (!constructionContainer.hits) {
                        creep.build(constructionContainer);
                    } else {
                        delete creep.memory.constructionContainer;
                        delete creep.memory.building;
                        creep.memory.container = constructionContainer.id;
                    }
                } else {
                    let target = Game.getObjectById(creep.memory.targetId);
                    creep.harvest(target); // можно оптимизировать метод getObjectById()
                }
            } else {
                let target = Game.getObjectById(creep.memory.targetId);
                creep.harvest(target); // можно оптимизировать метод getObjectById()
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
        
        creep.memory.container = structuresContainer[0].id;
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

function CreepInObjectRadius(creep, object, radius = 1) {
    let x = creep.pos.x - object.pos.x;
    let y = creep.pos.y - object.pos.y;
    return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
}
module.exports = roleMiner;