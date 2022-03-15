/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.depositMiner');
 * mod.thing == 'a thing'; // true
 */


// var moduleFunctions = require('module.functions');



// Game.spawns['Spawn1'].spawnCreep([...(new Array(12).fill(WORK)), 
//                                   ...(new Array(5).fill(CARRY)), 
//                                 ...(new Array(17).fill(MOVE))], 
//     'mine_'+Game.time, {memory: {role: 'depositMiner', rootRoomName: 'E2S17'}});

// 20 раз укусить
// 12 WORK 12 MOVE = 1800
// 5 CARRY = 250 => 500



module.exports = {
    run: function(creep) {
        
        if (creep.memory.storing === undefined) creep.memory.storing = false;

        if (!creep.memory.storing && (creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 250)) 
            creep.memory.storing = true;
        // if (creep.memory.storing && creep.store.getUsedCapacity() == 0)
        //     creep.memory.storing = false;

        if (creep.memory.storing && creep.store.getUsedCapacity() == 0 && creep.ticksToLive < 250) {
            let target_spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_SPAWN });
            if (target_spawn) {
                if (!CreepInObjectRadius(creep, target_spawn))
                    creep.moveTo(target_spawn);
                else target_spawn.recycleCreep(creep);
            } else {
                // ---- restPoint
            }
        }

        let route;
        if (!creep.memory.storing) {
            if (creep.room.name == 'E2S17' || creep.room.name == 'E1S17' || creep.room.name == 'E1S16') 
                route = Game.map.findRoute(creep.room, 'E0S16');
            else if (creep.room.name == 'E0S16' || creep.room.name == 'E0S17') 
                route = Game.map.findRoute(creep.room, 'E0S18');
            else if (creep.room.name == 'E0S18') 
                route = Game.map.findRoute(creep.room, 'W0S18');

            else if (creep.room.name == 'W0S18') {
                let deposit = creep.pos.findClosestByRange(FIND_DEPOSITS);
                if (deposit) {
                    if (creep.harvest(deposit) == ERR_NOT_IN_RANGE)
                        creep.moveTo(deposit, {visualizePathStyle: {stroke: 'green', opacity: 0.5}});
                } //else creep.moveTo(6, 40, {visualizePathStyle: {stroke: 'green', opacity: 0.5}});
            }
        } else {
            if (creep.room.name == 'W0S18')
                route = Game.map.findRoute(creep.room, 'E0S18');
            else if (creep.room.name == 'E0S18' || creep.room.name == 'E0S17')
                route = Game.map.findRoute(creep.room, 'E0S16');
            else if (creep.room.name == 'E0S16' || creep.room.name == 'E1S16' || creep.room.name == 'E1S17')
                route = Game.map.findRoute(creep.room, 'E2S17');
            else if (creep.room.name == 'E2S17') {

                if (creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
                    if (creep.room.terminal && creep.room.terminal.store.getFreeCapacity() > 0) {
                        for(let res in creep.store) {
                            if (res != RESOURCE_ENERGY) {
                                if(creep.transfer(creep.room.terminal, res) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: 'green'}});
                                    break;
                                }
                            }
                        }
                    } else if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
                        for(let res in creep.store) {
                            if (res != RESOURCE_ENERGY) {
                                if(creep.transfer(creep.room.storage, res) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: 'green'}});
                                    break;
                                }
                            }
                        }
                    }
                }
                
            }
        }

        if(route && route.length > 0) {
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit, {visualizePathStyle: {stroke: 'green', opacity: 0.5}});
        }
    } 
}


function CreepInObjectRadius(creep, object, radius = 1) {
    let x = creep.pos.x - object.pos.x;
    let y = creep.pos.y - object.pos.y;
    return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
}