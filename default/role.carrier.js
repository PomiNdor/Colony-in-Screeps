/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carrier');
 * mod.thing == 'a thing'; // true
 */
// var moduleConstants = require('module.constants');
var moduleFunctions = require('module.functions');
var moduleCreep = require('module.creep');
// const rootRoom = moduleConstants.roomRootName;
// const roomNames = moduleConstants.roomNames;

module.exports = {
    run: function(creep) {
        if (creep.memory.storing === undefined) creep.memory.storing = false;
        
        if (!creep.memory.storing && creep.store.getFreeCapacity() == 0) {
            creep.memory.storing = true;
            delete creep.memory.target;
        }
        if (creep.memory.storing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.storing = false;
        }
        
        // if (creep.hits < creep.hitsMax) {
        //     if (creep.memory.targetRoom) {
        //         let room = Memory.rooms[creep.memory.targetRoom];
        //         if (room) for (let i in room.carriers) {
        //             if (room.carriers[i] == creep.name) {
        //                 room.carriers.splice(i, 1);
        //                 delete creep.memory.targetRoom;
        //                 break;
        //             }
        //         }
        //     }
        //     if (creep.room.name != creep.memory.rootRoomName) {
        //         creep.say(creep.memory.rootRoomName);
                
        //         // Костыль, крипы застревали между комнатами
        //         let target = Game.rooms[creep.memory.rootRoomName].storage;
        //         if (target) {
        //             // console.log('storage room');
        //             creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        //         } else {
        //             let route = Game.map.findRoute(creep.room, creep.memory.rootRoomName);
        //             if (route.length > 0)
        //                 creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
        //         }
        //     }
        // } else 
        if (!creep.memory.storing) {
            if (!creep.memory.targetRoom) {
                creep.say("Find room!");
                let room = FindRoomForCarrier(creep);
                if (room) {
                    room.memory.carriers.push(creep.name);
                    creep.memory.targetRoom = room.name;
                } else {
                    creep.moveTo(15, 32);
                    return;
                }
            }
            if (creep.room.name != creep.memory.targetRoom) {
                creep.say(creep.memory.targetRoom);
                
                // Костыль, крипы застревали между комнатами
                let target;
                if (creep.memory.target)
                    target = Game.getObjectById(creep.memory.target.id);
                if (target) {
                    creep.moveTo(target);
                } else {
                    
                    let route = Game.map.findRoute(creep.room, creep.memory.targetRoom);
                    if (route.length > 0)
                        creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}})
                }      
                    
            } else {
                
                // Если нет цели в комнате (ресурс или контейнер)
                if (!creep.memory.target) {
                    //Game.creeps['carrier_29530184].pos.findClosestByRange(FIND_RUINS);
                    //
                    let ruinResource = creep.pos.findClosestByRange(FIND_RUINS, { filter: structure => structure.store[RESOURCE_ENERGY] > 0 });
                    let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: (energy) => { 
                        return energy.amount >= 100//creep.store.getFreeCapacity(RESOURCE_ENERGY)/2
                        
                    }});
                    let structureContainers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                            return  structure.structureType == STRUCTURE_CONTAINER &&
                                    structure.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity(RESOURCE_ENERGY)/2;
                        }
                    });
                    if (ruinResource) {
                        creep.memory.target = { id: ruinResource.id, type: 'ruinResource'};
                    }
                    else if (droppedResource) {
                        creep.memory.target = { id: droppedResource.id, type: 'dropped_resources'};
                    } else if (structureContainers.length > 0) {
                        creep.memory.target = { id: structureContainers[0].id, type: 'container'}
                    } else {
                        creep.say("Нет ресов!");
                        // Если не может найти ресов в комнате - смотрит строятся тут контейнеры или нет
                        // Если да, то он уходит в другую комнату т.к. в этой ресы будут не скоро
                        
                        // for (let i in Game.rooms[creep.memory.targetRoom].memory.resources) {
                        //     let resRoom = Game.rooms[creep.memory.targetRoom].memory.resources[i];
                        //     if (resRoom && resRoom.creeps) {
                        //         if (resRoom.creeps.length == 0) delete creep.memory.targetRoom;
                        //         else {
                        //             let miningBuild = true;
                        //             for (let i in resRoom.creeps) {
                        //                 if (Game.creeps[resRoom.creeps[i]] && !(Game.creeps[resRoom.creeps[i]].memory.constructionContainer)) {
                        //                     miningBuild = false;
                        //                     break;
                        //                 }
                        //             }
                        //             if (miningBuild) delete creep.memory.targetRoom;
                        //         }
                        //     }
                        // }
                    }
                } else {
                    let target = Game.getObjectById(creep.memory.target.id);
                    if (!target) {
                        delete creep.memory.target;
                    } else {
                        let error = 0;
                        if (creep.memory.target.type == 'ruinResource') {
                            if (target.store[RESOURCE_ENERGY] == 0) 
                                delete creep.memory.target;
                            else if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                error = creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        else if (creep.memory.target.type == 'dropped_resources') {
                            if (creep.pickup(target) == ERR_NOT_IN_RANGE)
                                error = creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        else if (creep.memory.target.type == 'container') {
                            if (target.store[RESOURCE_ENERGY] < creep.store.getFreeCapacity(RESOURCE_ENERGY)/2) {   // ТЕОРЕТИЧЕСКИ МНОГО ЖРЕТ из-за обновления
                                delete creep.memory.target;
                            } else 
                            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                error = creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        if (error != 0) {
                            creep.moveByPath(creep.room.findPath(creep.pos, target.pos, {maxRooms: 1}));
                        }
                    }
                }
            }
                
        } else {
            
            if (creep.memory.targetRoom) {
                let room = Memory.rooms[creep.memory.targetRoom];
                if (room) for (let i in room.carriers) {
                    if (room.carriers[i] == creep.name) {
                        room.carriers.splice(i, 1);
                        delete creep.memory.targetRoom;
                        break;
                    }
                }
            }
            
            
            if (creep.room.name != creep.memory.rootRoomName) {
                creep.say(creep.memory.rootRoomName);
                
                // Костыль, крипы застревали между комнатами
                let target = Game.rooms[creep.memory.rootRoomName].storage;
                if (target) {
                    // console.log('storage room');
                    creep.moveTo(target);
                } else {
                    let route = Game.map.findRoute(creep.room, creep.memory.rootRoomName);
                    if (route.length > 0)
                        creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } 
                else if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
                    if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};


function FindRoomForCarrier(creep) {
    //room.memory.countResEnergy
    //let maxResourcesEnergy = 0;
    let roomNames = moduleFunctions.FindRootRoomMemory(creep.memory.rootRoomName).miningRooms;
    let minigRooms = [];
    for (let i in roomNames) {
        var room = Game.rooms[roomNames[i]];
        if (room) {
            let hostile_attack_creeps = room.find(FIND_HOSTILE_CREEPS, {filter: creep => creep.body.find(part => part.type == ATTACK || part.type == RANGED_ATTACK)});
            if (!room.memory.carriers) room.memory.carriers = [];
            
            if (!hostile_attack_creeps || hostile_attack_creeps.length == 0)
                minigRooms.push(room);
        }   
    }
    
    //roomNames.sort((a,b) => a.hits - b.hits);
    minigRooms.sort((b,a) => (a.memory.countResEnergy - a.memory.carriers.length * creep.store.getCapacity())
            - (b.memory.countResEnergy - b.memory.carriers.length * creep.store.getCapacity()));
    
    if (minigRooms.length > 0)
        return minigRooms[0];
    
    // for (var i in roomNames) {
    //     var room = Game.rooms[roomNames[i]];
    //     if (room) {
    //         if (!room.memory.carriers)
    //             room.memory.carriers = [];
    //         if (roomCountRes > room.memory.carriers.length * creep.store.getCapacity() + creep.store.getCapacity()/3*2) {
    //             room.memory.carriers.push(creep.name);
    //             return room;
    //         }
    //     }
    //     // if (room && !room.memory.carriers)
    //     //     room.memory.carriers = [];
    //     // if (room && room.memory.carriers.length < room.memory.resources.length + room.memory.resources.length / 2 ) {
    //     //     room.memory.carriers.push(creep.name);
    //     //     return room;
    //     //     break;
    //     // }
    // }
}