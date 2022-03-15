/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transporter');
 * mod.thing == 'a thing'; // true
 */
let moduleFunctions = require('module.functions');

/*
    creep.memory: {
        storing: bool,
        targetId: string
    }
*/



module.exports = {
    run: function(creep) {

        if (creep.spawning) return;
        if (creep.room.name != creep.memory.fractionRoom) {
            creep.moveTo(Game.rooms[creep.memory.fractionRoom].controller, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }

        creep.CheсkStatus('storing');
        let storage_link = moduleFunctions.FindLink('storage', creep.room.name);
        
        if (!creep.memory.storing) {
            let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: target => target.amount > 100});
            // if (target_resource) console.log(target_resource.amount);
            let target_tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: target => target.store.getUsedCapacity() > 100}); // не тестил
            // console.log(creep.room.name, target_tombstone);
            let target_container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
                return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity();
            }});
            let target_containerMineral = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => {
                return  structure.structureType == STRUCTURE_CONTAINER && 
                        structure.store[RESOURCE_ENERGY] < structure.store.getUsedCapacity() - creep.store.getFreeCapacity();
            }});
            let target_ruins = creep.pos.findClosestByRange(FIND_RUINS, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 100}); // не тестил

            if (target_containerMineral) {
                for (let res in target_containerMineral.store) {
                    // console.log('res', res);
                    if (res != RESOURCE_ENERGY)
                        if(creep.withdraw(target_containerMineral, res) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target_containerMineral, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                }
            } 
            // else if (creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
            //     creep.memory.storing = true;
            // }
            
            else if (storage_link && storage_link.store[RESOURCE_ENERGY] != 800 && 
                    creep.room.storage && creep.InObjectRadius(creep.room.storage) && creep.room.storage.store[RESOURCE_ENERGY] > 20000) {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else if (target_resource) {
                // ---------------
                if (target_container && creep.InObjectRadius(target_container) && 
                (!creep.InObjectRadius(target_resource) || target_resource.amount < 100)) {
                    if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target_container, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_resource, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else if (target_tombstone) {
                for (let resName in target_tombstone.store) {
                    if(creep.withdraw(target_tombstone, resName) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target_tombstone, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                }   
            } else if (target_container) {
                if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_container, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else if (target_ruins) {  // ДОБАВИЛ СЕЙЧАС
                for (let res in target_ruins.store) {
                    // console.log('res', res);
                    if (res != RESOURCE_ENERGY)
                        if(creep.withdraw(target_ruins, res) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target_ruins, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                }
            } else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 110000) {
                if(creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            } else if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY]) {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY]) {
                if(creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            creep.PutResInBase();
            // let target_spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return (
            //                 structure.structureType == STRUCTURE_EXTENSION || 
            //                 structure.structureType == STRUCTURE_SPAWN) &&
            //                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //         }
            // });
            // let towers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
            //             return  structure.structureType == STRUCTURE_TOWER &&
            //                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //         }
            // });
            // towers.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
            // let target_lab = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //         filter: (structure) => structure.structureType == STRUCTURE_LAB 
            //             && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            // });



            // if (creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
            //     if (creep.room.terminal && creep.room.terminal.store.getFreeCapacity() > 0) {
            //         for(let res in creep.store) {
            //             if (res != RESOURCE_ENERGY) {
            //                 if(creep.transfer(creep.room.terminal, res) == ERR_NOT_IN_RANGE) {
            //                     creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //                     break;
            //                 }
            //             }
            //         }
            //     } else if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
            //         for(let res in creep.store) {
            //             if (res != RESOURCE_ENERGY) {
            //                 if(creep.transfer(creep.room.storage, res) == ERR_NOT_IN_RANGE) {
            //                     creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //                     break;
            //                 }
            //             }
            //         }
            //     }
            // }


            // else if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < 100) {
            //     if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.say('tower1');
            //         creep.moveTo(towers[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // }
            // else if (storage_link && storage_link.store[RESOURCE_ENERGY] != 800 && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 20000) {
            //     creep.say('link');
            //     if(creep.transfer(storage_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(storage_link, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // }
            // else if(target_spawn) {
            //     creep.say('spawn');
            //     if(creep.transfer(target_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target_spawn, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // } else if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < 600) {
            //     creep.say('tower');
            //     if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(towers[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // } else if (target_lab) {
            //     creep.say('lab');
            //     if(creep.transfer(target_lab, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target_lab, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // } else if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < 800) {
            //     creep.say('tower');
            //     if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(towers[0], {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // } else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 100000 && creep.room.terminal.store.getFreeCapacity() > 0) {
            //     creep.say('terminal');
            //     if(creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // } else if (creep.room.storage) {
            //     creep.say('storage');
            //     if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // } else {
            //     creep.say('else');
            //     let rootRoom = moduleFunctions.FindRootRoomMemory(creep.room.name);
            //     if (rootRoom && rootRoom.creeps.restPoint)
            //         creep.moveTo(rootRoom.creeps.restPoint.x, rootRoom.creeps.restPoint.y, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            // }
            
        }
    }
};