
var roleHarvester = require('role.harvester');
var roleBuilder =   require('role.builder');
var roleUpgrader =  require('role.upgrader');
var roleCarriUpgrader =  require('role.carriUpgrader');
var roleSpawner =   require('role.spawner');

var roleMiner =     require('role.miner');
var roleSearcher =  require('role.searcher');
var roleCarrier =   require('role.carrier');
var roleDamager =   require('role.damager');
var roleTower =     require('role.tower');
var roleTransporter =  require('role.transporter');
// E4S17

var moduleRoom = require('module.room');

module.exports.loop = function () {
    
    // Game.creeps['carrier_29573682'].moveTo(43, 25);
    //Game.creeps['carrier_29574074'].move(BOTTOM);
    //Game.creeps['carrier_29573682'].moveTo(44, 21);
    
    // --------- ROOMS
    moduleRoom.run();
    //Game.creeps['test_29542779'].moveTo(18, 48);
    
    // --------- SPAWN
    for(var name in Game.spawns)
        roleSpawner.run(Game.spawns[name]);
        
    // --------- TOWER
    _.forEach(['60e01b8ce63ac4823ee239fc', '60e390b7e23798720459b086', '60e640959ce544f9aa0d90d6', '60edabefa2303239febe6f16'], towerId => {
        var tower = Game.getObjectById(towerId);
        if(tower) roleTower.run(tower);
    });
    
    // --------- CREEPS

    for(var name in Game.creeps) {
        
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role == 'searcher') {
            roleSearcher.run(creep);
        }
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        
        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if(creep.memory.role == 'carriUpgrader') {
            roleCarriUpgrader.run(creep);
        }
        if (creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
        
        
        // if(creep.memory.role == 'dropper') {
        //     const route = Game.map.findRoute(creep.room, 'E3S16');
        //     if(route.length > 0) {
        //         creep.say(route[0].room);
        //         const exit = creep.pos.findClosestByRange(route[0].exit);
        //         creep.moveTo(exit, {visualizePathStyle: {stroke: 'blue', opacity: 0.3}});
        //     } else {
        //         if (creep.store[RESOURCE_ENERGY] > 0) {
        //             creep.drop(RESOURCE_ENERGY);
        //         } else {
        //             target_spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS, {
        //                 filter: structure => structure.store[RESOURCE_ENERGY] > 0});
                        
        //             target_sturcture = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
        //                 filter: (structure) => { return structure.structureType != 'controller' && structure.store[RESOURCE_ENERGY] > 0}
        //             });
        //             // if (target_spawn) {
        //             //     console.log(target_spawn);
        //             //     console.log(creep.withdraw(target_spawn, RESOURCE_ENERGY));
        //             //     if(creep.withdraw(target_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
        //             //         creep.moveTo(target_spawn, {visualizePathStyle: {stroke: 'blue'}});
        //             // } else 
        //             if (target_sturcture) {
        //                 console.log(creep.withdraw(target_sturcture, RESOURCE_ENERGY));
        //                 if(creep.withdraw(target_sturcture, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
        //                     creep.moveTo(target_sturcture, {visualizePathStyle: {stroke: 'blue'}});
        //             }
        //         }
        //     }
        // }
        
        if (creep.memory.role == 'reserver') {
            const route = Game.map.findRoute(creep.room, 'E1S17'); // E1S16 E2S16
            if(route.length > 0) {
                let exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
            }
            else if(creep.room.controller) {
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                }
            }
        }
        
        //Game.spawns['Spawn1'].spawnCreep([CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],'claimer_'+Game.time, {memory: {role: 'claimer'}});
        //Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],'claimer_'+Game.time, {memory: {role: 'claimer'}});
        if (creep.memory.role == 'claimer') {
            //console.log(creep.getObjectById('5bbcad559099fc012e63722e'));
            const route = Game.map.findRoute(creep.room, 'E1S17'); // E1S16 E2S16
            
            if(route.length > 0) {
                console.log('Now heading to room '+route[0].room);
                // if (creep.room.name == 'E2S16')
                //     creep.moveTo(33, 0, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                // else if (creep.room.name == 'E2S15')
                //     creep.moveTo(49, 34, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                // else if (creep.room.name == 'E3S15')
                //     creep.moveTo(49, 39, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                // else if (creep.room.name == 'E4S15')
                //     creep.moveTo(10, 49, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                // else {
                    let exit = creep.pos.findClosestByRange(route[0].exit);
                    //creep.moveTo(49, 38,  {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                    creep.moveTo(exit, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                //}
                    
            }
            else {
                // if (creep.pos.x != 12 && creep.pos.y != 3) creep.moveTo(12, 3);
                // else creep.memory.role = 'builder';
                
                if(creep.room.controller) {
                    if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                    }
                }
            }
        }
        
        
        let damagerParts = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        // Game.spawns['Spawn2'].spawnCreep(damagerParts, 'damager_'+Game.time, {memory: {role: 'damager'}});
        //let damagerParts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        //Game.spawns['Spawn1'].spawnCreep(damagerParts, 'damager_'+Game.time, {memory: {role: 'damager'}});
        //Game.spawns['Spawn1'].spawnCreep([ATTACK, MOVE], 'damager_'+Game.time, {memory: {role: 'damager'}});
        if (creep.memory.role == 'damager') {
            roleDamager.run(creep);
        }
        
        
        if (creep.memory.role == 'testCarry') {
            if (creep.memory.storing && creep.store.getUsedCapacity() == 0)
                creep.memory.storing = false;
            if (!creep.memory.storing && creep.store.getFreeCapacity() == 0)
                creep.memory.storing = true;
                
            if (creep.room.name == 'E5S17') {
                if (creep.memory.storing) {
                    creep.moveTo(new RoomPosition(29, 8, 'E4S17'), {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    let storage = Game.getObjectById('60eca82ef3bfad88c0c94955');
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                    
            } else if (creep.room.name == 'E4S17') {
                if (creep.memory.storing) {
                    if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.moveTo(new RoomPosition(11, 41, 'E5S17'), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                if (creep.memory.storing) {
                    creep.moveTo(new RoomPosition(29, 8, 'E4S17'), {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.moveTo(new RoomPosition(11, 41, 'E5S17'), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        
        
    }
    
}
