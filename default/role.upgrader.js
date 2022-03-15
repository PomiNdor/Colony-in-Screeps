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
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('🚧 upgraid');
	    }
        
        
	    if(!creep.memory.upgrading) {
	        let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            let target_container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
                return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 100;
            }});
            var sources = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            
            if (target_resource && CreepInObjectRadius(creep, target_resource)) {
                if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_resource, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else if (target_container && CreepInObjectRadius(creep, target_container)) {
                if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_container);
            }
            else if (target_resource) {
                if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_resource, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (target_container) {
                if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_container);
            } else if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffffff'}});
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


function CreepInObjectRadius(creep, object, radius = 1) {
    let x = creep.pos.x - object.pos.x;
    let y = creep.pos.y - object.pos.y;
    return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
}