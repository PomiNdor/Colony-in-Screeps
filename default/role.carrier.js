/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carrier');
 * mod.thing == 'a thing'; // true
 */
var moduleConstants = require('module.constants');
const rootRoom = moduleConstants.roomRootName;
const roomNames = moduleConstants.roomNames;

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
        
        if (!creep.memory.storing) {
            if (!creep.memory.targetRoom) {
                creep.say("Find room!");
                let room = FindRoomForCarrier(creep);
                if (room) creep.memory.targetRoom = room.name;
                else return;
            } else if (creep.room.name != creep.memory.targetRoom) {
                creep.say(creep.memory.targetRoom);
                let route = Game.map.findRoute(creep.room, creep.memory.targetRoom);
                if (route.length > 0)
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                
                // Если нет цели в комнате (ресурс или контейнер)
                if (!creep.memory.target) {
                    let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: (energy) => { 
                        return energy.amount >= creep.store.getFreeCapacity(RESOURCE_ENERGY)/2}});
                    let structureContainers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                            return  structure.structureType == STRUCTURE_CONTAINER &&
                                    structure.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity(RESOURCE_ENERGY)/2;
                        }
                    });
                    if (droppedResource) {
                        creep.memory.target = { id: droppedResource.id, type: 'dropped_resources'};
                    } else if (structureContainers.length > 0) {
                        creep.memory.target = { id: structureContainers[0].id, type: 'container'}
                    }
                } else {
                    let target = Game.getObjectById(creep.memory.target.id);
                    if (!target) {
                        delete creep.memory.target;
                    } else {
                        if (creep.memory.target.type == 'dropped_resources') {
                            if (creep.pickup(target) == ERR_NOT_IN_RANGE)
                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        if (creep.memory.target.type == 'container') {
                            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            }
                
        } else {
            if (creep.room.name != rootRoom) {
                creep.say(rootRoom);
                let route = Game.map.findRoute(creep.room, rootRoom);
                if (route.length > 0)
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
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
                } else if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};


function FindRoomForCarrier(creep) {
    //let maxResourcesEnergy = 0;
    for (var i in roomNames) {
        var room = Game.rooms[roomNames[i]];
        if (room && !room.memory.carriers)
            room.memory.carriers = [];
        if (room && room.memory.carriers.length <= room.memory.resources.length ) {
            room.memory.carriers.push(creep.name);
            return room;
            break;
        }
    }
}