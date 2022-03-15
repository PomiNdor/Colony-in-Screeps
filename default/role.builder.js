/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
const builderColor = '#FFA500';

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets_build = creep.room.find(FIND_CONSTRUCTION_SITES);
	        var targets_repair = creep.room.find(FIND_STRUCTURES, {
	            filter: object => object.hits < object.hitsMax});
	        targets_repair.sort((a,b) => a.hits - b.hits);
	        
	        if (targets_repair.length && targets_repair[0].hits < 2000) {
	            if (creep.repair(targets_repair[0]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(targets_repair[0], {visualizePathStyle: {stroke: builderColor}});
	            }
	        }
            else if(targets_build.length) {
                if(creep.build(targets_build[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets_build[0], {visualizePathStyle: {stroke: builderColor}});
                }
            // } else if (targets_repair.length) {
	           // if (creep.repair(targets_repair[0]) == ERR_NOT_IN_RANGE) {
	           //     creep.moveTo(targets_repair[0], {visualizePathStyle: {stroke: builderColor}});
	           // }
	        } else if (creep.pos.x != 15 && creep.pos.y != 33) {
                creep.say("ffff");
                creep.moveTo(15, 33, {visualizePathStyle: {stroke: builderColor}});
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES_ACTIVE); //creep.room.find(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: builderColor}});
            }
	    }
	}
};

module.exports = roleBuilder;