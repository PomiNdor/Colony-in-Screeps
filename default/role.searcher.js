/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.searcher');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        if (Memory.NoSearchedRooms && Memory.NoSearchedRooms.length != 0) {
            if (!(_.find(Memory.NoSearchedRooms, room => room.name == creep.room.name))) {
                let route = Game.map.findRoute(creep.room, Memory.NoSearchedRooms[0].name);
                Memory.Route = route;
                if (route.length > 0)
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                creep.moveTo(25, 25);
            }
        }
    }
};