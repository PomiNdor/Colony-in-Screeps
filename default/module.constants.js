/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.constants');
 * mod.thing == 'a thing'; // true
 */
const rootRooms = [
    { name: 'E2S17', miningRooms: ['E1S17', 'E2S18', 'E1S16', 'E1S18'] }
]
const roomNames = ['E1S17', 'E2S18', 'E1S16', 'E1S18'];


module.exports = {
    // setRootRoomsSettings: function() {
    //     Memory.rootRooms = rootRooms;
    //     _.forEach(Memory.rootRooms, rootRoom => {
    //       console.log(rootRoom); 
    //     });
        
        
        
    //     // let miners = 0;
    //     // for (let i in roomNames) {
    //     //     let room = Memory.rooms[roomNames[i]];
    //     //     if (room)
    //     //         miners += room.resources.length;
    //     // }
        
    //     // Memory.
    // },
    roomRootName: 'E2S17',
    roomNames: roomNames  // 'E2S17' 'E1S16'
};