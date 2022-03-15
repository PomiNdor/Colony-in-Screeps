/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.functions');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    FindRootRoomMemory: function(roomName) {
        for (let i in Memory.rootRooms)
            if (Memory.rootRooms[i].name == roomName)
                return Memory.rootRooms[i];
    }
};