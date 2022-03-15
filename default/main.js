
var roleHarvester = require('role.harvester');
var roleBuilder =   require('role.builder');
var roleUpgrader =  require('role.upgrader');
var roleCarriUpgrader =  require('role.carriUpgrader');
var roleSpawner =   require('role.spawner');

var roleMiner =     require('role.miner');
var roleSearcher =  require('role.searcher');
var roleCarrier =  require('role.carrier');
var roleDamager =  require('role.damager');
var roleTower =  require('role.tower');
// E4S17

var moduleRoom =        require('module.room');
var moduleConstants =   require('module.constants');

const roomNames = moduleConstants.roomNames;  // 'E2S17'

module.exports.loop = function () {
    moduleRoom.setRootRoomsConstants();
    
    
    // --------- SPAWN
    for(var name in Game.spawns) {
        roleSpawner.run(Game.spawns[name]);
    }
    
    // --------- ROOMS
    roomNames.forEach(nameRoom => {
        //moduleRoom.refresh(Game.rooms[nameRoom], 'f7e936eb12ab2716ef044d2f');
        
        moduleRoom.set(nameRoom);
        if (Memory.rooms && Memory.rooms[nameRoom]) {
            moduleRoom.actualize(nameRoom);
            moduleRoom.visualize(nameRoom);
        }
            
    });
    
    
    // --------- TOWER
    
    _.forEach(['60e01b8ce63ac4823ee239fc', '60e390b7e23798720459b086'], towerId => {
        var tower = Game.getObjectById(towerId);
        if(tower) roleTower.run(tower);
    });
    
    
    // --------- SPAWN
    roleSpawner.run(Game.spawns['Spawn1']);
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
        
        
        
        //Game.spawns['Spawn1'].spawnCreep([CLAIM, WORK, CARRY, MOVE, MOVE, MOVE],'claimer_'+Game.time, {memory: {role: 'claimer'}});
        //Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],'claimer_'+Game.time, {memory: {role: 'claimer'}});
        if (creep.memory.role == 'claimer') {
            //console.log(creep.getObjectById('5bbcad559099fc012e63722e'));
            const route = Game.map.findRoute(creep.room, 'E4S17');
            
            if(route.length > 0) {
                console.log('Now heading to room '+route[0].room);
                if (creep.room.name == 'E2S16')
                    creep.moveTo(33, 0, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                else if (creep.room.name == 'E2S15')
                    creep.moveTo(49, 34, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                else if (creep.room.name == 'E3S15')
                    creep.moveTo(49, 39, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                else if (creep.room.name == 'E4S15')
                    creep.moveTo(10, 49, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                else {
                    let exit = creep.pos.findClosestByRange(route[0].exit);
                    //creep.moveTo(49, 38,  {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                    creep.moveTo(exit, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                }
                    
            }
            else {
                if (creep.pos.x != 12 && creep.pos.y != 3) creep.moveTo(12, 3);
                else creep.memory.role = 'builder';
                // var sources = creep.room.find(FIND_SOURCES_ACTIVE); //creep.room.find(FIND_SOURCES_ACTIVE);
                // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
                // }
                // if(creep.room.controller) {
                //     if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                //     }
                // }
            }
        }
        
        let damagerParts = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE];
        //Game.spawns['Spawn1'].spawnCreep(damagerParts, 'damager_'+Game.time, {memory: {role: 'damager'}});
        //Game.spawns['Spawn1'].spawnCreep([ATTACK, MOVE], 'damager_'+Game.time, {memory: {role: 'damager'}});
        if (creep.memory.role == 'damager') {
            roleDamager.run(creep);
        }
        
        
    }
    
}
