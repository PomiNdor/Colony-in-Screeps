/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.functions');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    FindFractionMemory: function(roomName) {
        for (let i in Memory.fractions) {
            // Если это fractionRoomName
            if (Memory.fractions[i].roomName == roomName)
                return Memory.fractions[i];
                
            // Если это mineRoomName
            for (let j in Memory.fractions[i].miningRoomsName) 
                if (Memory.fractions[i].miningRoomsName[j] == roomName)
                    return Memory.fractions[i];
        }
    },
    FindLink: (type, roomName) => {
        let memoryRoom = Memory.rooms[roomName];
        if (memoryRoom && memoryRoom.links && memoryRoom.links[type])
            return Game.getObjectById(memoryRoom.links[type].id);
    }
};