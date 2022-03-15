/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var roles = {
    'upgrader': require('role.upgrader')
};
const builderColor = '#FFA500';

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.spawning) return;
        creep.CheсkStatus('building');

	    if(creep.memory.building) {
            
                var targets_build = creep.room.find(FIND_CONSTRUCTION_SITES);
                var targets_repair = [];
                // = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax});
                // targets_repair.sort((a,b) => a.hits - b.hits);
                
                if (targets_repair.length && targets_repair[0].hits < 2000) {
                    if (creep.repair(targets_repair[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets_repair[0], {visualizePathStyle: {stroke: builderColor}});
                    }
                } else if(targets_build.length) {
                    if(creep.build(targets_build[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets_build[0], {visualizePathStyle: {stroke: builderColor}});
                    }
               } else {
                    roles['upgrader'].run(creep);
                }
	        
	    } else {
            let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: target => target.resourceType == RESOURCE_ENERGY && target.amount > 100}); // не тестил
            let target_tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил
            let target_ruins = creep.pos.findClosestByRange(FIND_RUINS, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил


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
                    
            } else {    // То что было раньше
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE); //creep.room.find(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: builderColor}});
                }
            }
	        
	    }
	}
};

module.exports = roleBuilder;