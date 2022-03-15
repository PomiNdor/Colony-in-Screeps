/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carriUpgrader');
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
        let control_link;
        if (creep.room.name == 'E2S17') 
            control_link = Game.getObjectById('60e3a51f7e4e8db256c215b0');
        if (creep.room.name == 'E4S17') 
            control_link = Game.getObjectById('60edb85c0281ea05f157f27f');
            
        if (control_link && control_link.store[RESOURCE_ENERGY] > 0) {
            if (creep.withdraw(control_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(control_link, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        
	    if(!creep.memory.upgrading) {
	            
            if (control_link && control_link.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(control_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(control_link, {visualizePathStyle: {stroke: '#ffffff'}});
            } 
            else if(creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 20000) {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] > 100000) {
                if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                creep.moveTo(25, 22);
            }
        }
        else {
            var targets_build;// = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets_build && targets_build.length) {
                if(creep.build(targets_build[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets_build[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleUpgrader;