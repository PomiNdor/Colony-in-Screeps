/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
 
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.spawning) return;
        creep.CheсkStatus('upgrading');
        
        
	    if(!creep.memory.upgrading) {
            let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: target => target.amount > 100});
            let target_tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил
            let target_ruins = creep.pos.findClosestByRange(FIND_RUINS, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил
            let target_container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
                return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity();
            }});
            
            
            if (target_resource) {
                if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_resource, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else if (target_tombstone) {
                if(creep.withdraw(target_tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_tombstone, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            } else if (target_ruins) {
                if(creep.withdraw(target_ruins, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_ruins, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            } else if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= 10000) {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else if (target_container) {
                if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_container, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else {
                var sources = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleUpgrader;