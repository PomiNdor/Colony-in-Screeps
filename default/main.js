
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleSpawner = require('role.spawner');

var roleMiner = require('role.miner');
var moduleRoom = require('module.room');

const roomNames = ['W7S33'];  // 'E2S17'

module.exports.loop = function () {
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    
    // --------- ROOMS
    roomNames.forEach(nameRoom => {
        //moduleRoom.refresh(Game.rooms[nameRoom], 'f7e936eb12ab2716ef044d2f');
        moduleRoom.set(Game.rooms[nameRoom]);
        moduleRoom.visualize(Game.rooms[nameRoom]);
    });
    
    
    // --------- TOWER
    // var tower = Game.getObjectById('60e01b8ce63ac4823ee239fc');
    // if(tower) {
    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    //     if (tower.energy > 500) {
    //         var targets_repair = tower.room.find(FIND_STRUCTURES, {
    //             filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL});
    //         targets_repair.sort((a,b) => a.hits - b.hits);
    //         if (targets_repair.length)
    //             tower.repair(targets_repair[0]);
    //     }
        
    // }
    
    // --------- SPAWN
    roleSpawner.run(Game.spawns['Spawn1']);
    // --------- CREEPS

    for(var name in Game.creeps) {
        
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        
        
        // if (creep.memory.role == 'test') {
        //     //console.log(creep.getObjectById('5bbcad559099fc012e63722e'));
        //     const route = Game.map.findRoute(creep.room, 'E3S8');
        //     if(route.length > 0) {
        //         console.log('Now heading to room '+route[0].room);
        //         const exit = creep.pos.findClosestByRange(route[0].exit);
        //         creep.moveTo(exit, {visualizePathStyle: {stroke: 'red'}});
        //     }
        //     else {
        //         const target_creeps = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);//FIND_HOSTILE_CREEPS
        //         if(target_creeps != null) {
        //             if(creep.attack(target_creeps) == ERR_NOT_IN_RANGE) {
        //                 creep.moveTo(target_creeps, {visualizePathStyle: {stroke: 'red'}});
        //             }
        //         } else {
        //             target_spawns = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);//FIND_HOSTILE_CREEPS
        //             if(creep.attack(target_spawns) == ERR_NOT_IN_RANGE) {
        //                 creep.moveTo(target_spawns, {visualizePathStyle: {stroke: 'red'}});
        //             }
        //         }
        //     }
        // }
        
        
    }
    
}
