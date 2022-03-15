/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.constants');
 * mod.thing == 'a thing'; // true
 */
const rootRooms = [
    { name: 'E2S17', miningRooms: ['E1S17', 'E2S18', 'E1S16', 'E1S18'] } // 'E1S18'
]
const roomNames = ['E1S17', 'E2S18', 'E1S16', 'E1S18']; // 'E1S18'


module.exports = {
    setRootRoomsConstants: function() {
        Memory.rootRooms = rootRooms;
        for (let i in Memory.rootRooms) {
            let rootRoom = Memory.rootRooms[i];
           
            let miners = 0;
            _.forEach(rootRoom.miningRooms, miningRoom => {
                if (Memory.rooms[miningRoom] && Memory.rooms[miningRoom].resources)
                    miners += Memory.rooms[miningRoom].resources.length;
            });
            rootRoom.miners_countMax = miners;
            rootRoom.carriers_countMax = miners + (miners / 2);
            //rootRoom.rootMiners_countMax = Memory.rooms[rootRoom].resources.length;
            rootRoom.rootCarrier_countMax = 1;
        };
        
        
        
        // let miners = 0;
        // for (let i in roomNames) {
        //     let room = Memory.rooms[roomNames[i]];
        //     if (room)
        //         miners += room.resources.length;
        // }
        
        // Memory.
    },
    roomRootName: 'E2S17',
    roomNames: roomNames  // 'E2S17' 'E1S16'
};