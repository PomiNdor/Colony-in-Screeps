/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transporter');
 * mod.thing == 'a thing'; // true
 */
let moduleFunctions = require('module.functions');

module.exports = {
    run: function(creep) {
                
        if (creep.room.name != creep.memory.rootRoomName) {
            creep.moveTo(Game.rooms[creep.memory.rootRoomName].controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        
        if (creep.memory.taking && creep.store.getFreeCapacity() == 0)
            creep.memory.taking = false;
        if (!creep.memory.taking && creep.store.getUsedCapacity() == 0)
            creep.memory.taking = true;
        
        if (creep.memory.taking) {
            let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            let target_container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
                return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 100;
            }});
            let target_containerMineral = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => {
                return  structure.structureType == STRUCTURE_CONTAINER && 
                        structure.store[RESOURCE_ENERGY] < structure.store.getUsedCapacity() - creep.store.getFreeCapacity();
            }});
            // console.log(target_containerMineral);
            if (target_containerMineral) {
                for (let res in target_containerMineral.store) {
                    // console.log('res', res);
                    if (res != RESOURCE_ENERGY)
                        if(creep.withdraw(target_containerMineral, res) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target_containerMineral, {visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                }
            } else if (creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
                creep.memory.taking = false;
            }
            else if (target_container && CreepInObjectRadius(creep, target_container)) {
                if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_container, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else if (target_resource) {
                if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_resource, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (target_container) {
                if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_container);
            } else if (creep.room.storage) {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                // -----------------------
            }
        } else {
            
            let targets_spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            let towers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                        return  structure.structureType == STRUCTURE_TOWER &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            towers.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
            
            if (creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
                if (creep.room.terminal && creep.room.terminal.store.getFreeCapacity() > 0) {
                    for(let res in creep.store) {
                        if (res != RESOURCE_ENERGY) {
                            if(creep.transfer(creep.room.terminal, res) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
                                break;
                            }
                        }
                    }
                } else if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
                    for(let res in creep.store) {
                        if (res != RESOURCE_ENERGY) {
                            if(creep.transfer(creep.room.storage, res) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                                break;
                            }
                        }
                    }
                }
            }


            
            else if(targets_spawn) {
                if(creep.transfer(targets_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets_spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < 750) {
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 100000 && creep.room.terminal.store.getFreeCapacity() > 0) {
                if(creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (creep.room.storage) {
                if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                let rootRoom = moduleFunctions.FindRootRoomMemory(creep.room.name);
                if (rootRoom && rootRoom.creeps.restPoint)
                    creep.moveTo(rootRoom.creeps.restPoint.x, rootRoom.creeps.restPoint.y, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
        }
        
        
        
    }
};

function CreepInObjectRadius(creep, object, radius = 1) {
    let x = creep.pos.x - object.pos.x;
    let y = creep.pos.y - object.pos.y;
    return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
}