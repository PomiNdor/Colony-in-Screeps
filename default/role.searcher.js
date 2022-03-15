/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.searcher');
 * mod.thing == 'a thing'; // true
 */

var moduleFunctions = require('module.functions');

module.exports = {
    run: function(creep) {
        let fraction = moduleFunctions.FindFractionMemory(creep.memory.fractionRoom);
        if (fraction && fraction.NoSearchedRooms && fraction.NoSearchedRooms.length != 0) {
            if (!(_.find(fraction.NoSearchedRooms, room => room.name == creep.room.name))) {
                let route = Game.map.findRoute(creep.room, fraction.NoSearchedRooms[0].name);
                if (route.length > 0)
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                creep.moveTo(25, 25);
            }
        }
    }
};