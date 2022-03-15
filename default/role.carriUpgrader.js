/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carriUpgrader');
 * mod.thing == 'a thing'; // true
 */
var moduleFunctions = require('module.functions');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.spawning) return;
        creep.CheсkStatus('upgrading');

        let controller_link = moduleFunctions.FindLink('controller', creep.room.name);
        // console.log(controller_link);
        if (controller_link && controller_link.store[RESOURCE_ENERGY] > 0) {
            if (creep.withdraw(controller_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(controller_link, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        


	    if(!creep.memory.upgrading) {
	            
            if (controller_link && controller_link.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(controller_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(controller_link, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
	}
};

module.exports = roleUpgrader;