/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carrier');
 * mod.thing == 'a thing'; // true
 */

var moduleFunctions = require('module.functions');
var moduleCreep = require('module.creep');

/*
    creep.memory: {
        role: string,
        fractionRoom: string,

        storing: bool,
        targetId: string,
        usedCPU: { max: float, last: float, acum: float }
    }
*/


module.exports = {
    run: function(creep) {
        if (creep.spawning) return;
        if (!creep.memory.storing && creep.store.getFreeCapacity() == 0)
            delete creep.memory.target; // Возможно не нужно
        creep.CheсkStatus('storing');
        
        
        const startCpu = Game.cpu.getUsed();
        const fraction = moduleFunctions.FindFractionMemory(creep.memory.fractionRoom);


        if (!creep.memory.storing) {
            if (!creep.memory.targetRoom) {
                creep.say("Find room!");
                let room = FindRoomForCarrier(creep, fraction);
                if (room) {
                    room.memory.carriers.push(creep.name);
                    creep.memory.targetRoom = room.name;
                } else {
                    creep.moveTo(fraction.restPoint.x, fraction.restPoint.y);
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
                    let ruinResource = creep.pos.findClosestByRange(FIND_RUINS, { filter: structure => structure.store.getUsedCapacity() > 0 }); // structure.store[RESOURCE_ENERGY] > 0
                    let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: (energy) => { 
                        return energy.amount >= 100//creep.store.getFreeCapacity(RESOURCE_ENERGY)/2
                        
                    }});
                    let structureContainers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                            return  structure.structureType == STRUCTURE_CONTAINER &&
                                    structure.store.getUsedCapacity() >= creep.store.getFreeCapacity()/2;   //  structure.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity(RESOURCE_ENERGY)/2;
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
                        if (creep.store.getUsedCapacity() > creep.store.getCapacity() / 2)
                            creep.memory.storing = true;
                        delete creep.memory.targetRoom;
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
                delete creep.memory.targetRoom;
                let memoryRoom = Memory.rooms[creep.memory.targetRoom];
                if (memoryRoom) for (let i in memoryRoom.carriers) {
                    if (memoryRoom.carriers[i] == creep.name) {
                        memoryRoom.carriers.splice(i, 1);
                        break;
                    }
                }
            }
            
            if (creep.room.name != creep.memory.fractionRoom) {
                creep.say(creep.memory.fractionRoom);
                
                // Костыль, крипы застревали между комнатами
                let target = Game.rooms[creep.memory.fractionRoom].storage;
                if (target) {
                    // console.log('storage room');
                    creep.moveTo(target);
                } else {
                    let route = Game.map.findRoute(creep.room, creep.memory.fractionRoom);
                    if (route.length > 0)
                        creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.PutResInBase();
                // if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
                //     if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                //         creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                // }
                // else if (creep.room.terminal && creep.room.terminal.store.getFreeCapacity() > 0)
                //     if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                //         creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }

        const elapsedCPU = Game.cpu.getUsed() - startCpu;
        if (!creep.memory.usedCPU) {
            creep.memory.usedCPU = {};
            creep.memory.usedCPU.max = 0;
            creep.memory.usedCPU.acum = 0;
        }
        if (creep.memory.usedCPU.max < elapsedCPU) 
            creep.memory.usedCPU.max = elapsedCPU;
        creep.memory.usedCPU.last = elapsedCPU;
        creep.memory.usedCPU.acum += elapsedCPU;
    }
};


function FindRoomForCarrier(creep, fraction) {
    let roomNames = fraction.miningRoomsName;
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
    let creepCapacity = creep.store.getCapacity();  // creep.store.getCapacity() - creep.store.getCapacity()/4
    //roomNames.sort((a,b) => a.hits - b.hits);
    minigRooms = minigRooms.sort((b,a) => (a.memory.countResEnergy - a.memory.carriers.length * creepCapacity) - (b.memory.countResEnergy - b.memory.carriers.length * creepCapacity));
    if (minigRooms.length > 0)
        return minigRooms[0];
}