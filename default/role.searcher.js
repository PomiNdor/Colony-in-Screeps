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
            // if (creep.room != Memory.NoSearchedRooms[0]) {
                
            //     let route = Game.map.findRoute(creep.room, Memory.NoSearchedRooms[0].name);
            //     //console.log(route);
            //     // if (route.length > 0)
            //     //     creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}});
            // }
            if (!(_.find(Memory.NoSearchedRooms, room => room.name == creep.room.name))) {
                // console.log(Memory.NoSearchedRooms[0].name);
                // let t = FindMinRangeRoom(creep);
                // let route = Game.map.findRoute(creep.room.name, t.name);
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
// function FindMinRangeRoom(creep) {
//     let minRoom = Memory.NoSearchedRooms[0];
//     let minRange = Game.map.getRoomLinearDistance(creep.room.name, Memory.NoSearchedRooms[0].name); // creep.pos.getRangeTo(Game.getObjectById(minRes.id));
//     _.forEach(Memory.NoSearchedRooms, (room) => {
//         let range = Game.map.getRoomLinearDistance(creep.room.name, room.name); //creep.pos.getRangeTo(Game.getObjectById(res.id));
//         console.log(room.name, " ", range);
//         if (range < minRange) {
//             minRoom = room;
//             minRange = range;
//         }
//     });
//     return minRoom;
// }