/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.reserver');
 * mod.thing == 'a thing'; // true
 */
var moduleFunctions = require('module.functions');
var moduleCreep = require('module.creep');

module.exports = {
    run: function(creep) {
        let route;
        let targetRoom = 'W42N4';//'W43N4';
        let movingRooms = ['W44N0', 'W40N0', 'W40N3', 'W42N4'];

        if (creep.room.name != targetRoom) {
            if (!creep.memory.stage) creep.memory.stage = 0;
            if (creep.memory.stage < movingRooms.length)

            if (movingRooms[creep.memory.stage] == creep.room.name) 
                creep.memory.stage++;

            route = Game.map.findRoute(creep.room, movingRooms[creep.memory.stage]); // E1S16 E2S16
            if(route && route.length > 0) {
                let exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
            }

        } else {
            if(creep.room.controller) {
                if (creep.room.controller.my) {
                    if ((creep.pos.x > 40 || creep.pos.x < 10) || (creep.pos.y > 40 || creep.pos.y < 10)) 
                        creep.moveTo(25, 25, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                    else {
                        creep.memory.role = 'upgrader';
                        creep.memory.fractionRoom = creep.room.name;
                    }
                }
                else if (creep.room.controller.owner) {
                    let err = creep.attackController(creep.room.controller);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                    } else if (err == 0)
                        console.log(err);
                }
                else {
                    // if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    //     creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                    // }
                    if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                    }
                }
            }
        }
    }
};



          