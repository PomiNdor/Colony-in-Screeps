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

        // Есть ли целевая комната
        if (!creep.memory.targetRoom) {
            creep.say("Find room!");
            let room = FindRoomForReserver(creep);
            if (room) {
                room.memory.reservers.push(creep.name);
                creep.memory.targetRoom = room.name;
            } else {
                creep.moveTo(15, 32);
                return;
            }
        }


        
        if (creep.spawning) return;
        if (creep.room.name != creep.memory.targetRoom) {
            creep.say(creep.memory.targetRoom);
            
            // Костыль, крипы застревали между комнатами
            let target;
            if (creep.memory.target)
                target = Game.getObjectById(creep.memory.target.id);
            if (target) {
                creep.moveTo(target);
            } else {
                let route = Game.map.findRoute(creep.room, creep.memory.targetRoom);
                if (route.length > 0)
                    creep.moveTo(creep.pos.findClosestByRange(route[0].exit), {visualizePathStyle: {stroke: '#ffffff'}})
            }      
                
        } else {
            if (creep.room.controller) {
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {maxRooms: 1, visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                }
            }
        }


        // const route = Game.map.findRoute(creep.room, 'E1S17'); // E1S16 E2S16
        // if(route.length > 0) {
        //     let exit = creep.pos.findClosestByRange(route[0].exit);
        //     creep.moveTo(exit, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
        // }
        // else if(creep.room.controller) {
        //     if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
        //     }
        // }
    }
};


function FindRoomForReserver(creep) {

    let fraction = moduleFunctions.FindFractionMemory(creep.memory.fractionRoom);
    let roomNames = fraction.miningRoomsName;
    let minigRooms = [];
    for (let i in roomNames) {
        var gameRoom = Game.rooms[roomNames[i]];
        if (gameRoom) {
            let hostile_attack_creeps = gameRoom.find(FIND_HOSTILE_CREEPS, {filter: creep => creep.body.find(part => part.type == ATTACK || part.type == RANGED_ATTACK)});
            if (!gameRoom.memory.reservers) gameRoom.memory.reservers = [];
            
            if (gameRoom.memory.reservers.length == 0 && (!gameRoom.controller.reservation ||
                gameRoom.controller.reservation.ticksToEnd < fraction.reservingMinTick)
                && (!hostile_attack_creeps || hostile_attack_creeps.length == 0))
                minigRooms.push(gameRoom);
        }   
    }
    //roomNames.sort((a,b) => a.hits - b.hits);
    minigRooms.sort((a, b) => {
        let tickA = (a.controller.reservation && a.controller.reservation.ticksToEnd > fraction.reservingMinTick)
                     ? a.controller.reservation.ticksToEnd : 0,
            tickB = (b.controller.reservation && b.controller.reservation.ticksToEnd > fraction.reservingMinTick)
                     ? b.controller.reservation.ticksToEnd : 0;
                     
        return tickA - tickB; //a.controller.reservation.ticksToEnd - b.controller.reservation.ticksToEnd
    });
    
    if (minigRooms.length > 0)
        return minigRooms[0];
    
    // for (var i in roomNames) {
    //     var room = Game.rooms[roomNames[i]];
    //     if (room) {
    //         if (!room.memory.carriers)
    //             room.memory.carriers = [];
    //         if (roomCountRes > room.memory.carriers.length * creep.store.getCapacity() + creep.store.getCapacity()/3*2) {
    //             room.memory.carriers.push(creep.name);
    //             return room;
    //         }
    //     }
    //     // if (room && !room.memory.carriers)
    //     //     room.memory.carriers = [];
    //     // if (room && room.memory.carriers.length < room.memory.resources.length + room.memory.resources.length / 2 ) {
    //     //     room.memory.carriers.push(creep.name);
    //     //     return room;
    //     //     break;
    //     // }
    // }
}