
var roleHarvester = require('role.harvester');
var roleBuilder =   require('role.builder');
var roleUpgrader =  require('role.upgrader');
var roleCarriUpgrader =  require('role.carriUpgrader');
var roleSpawner =   require('role.spawner');

var roleMiner =     require('role.miner');
var roleSearcher =  require('role.searcher');
var roleCarrier =  require('role.carrier');
// E4S17

var moduleRoom =        require('module.room');
var moduleConstants =   require('module.constants');

const roomNames = moduleConstants.roomNames;  // 'E2S17'

module.exports.loop = function () {
    //moduleConstants.setRootRoomsSettings();
    
    
    
    
    // --------- SPAWN
    roleSpawner.run(Game.spawns['Spawn1']);
    
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
    var tower = Game.getObjectById('60e01b8ce63ac4823ee239fc');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        if (tower.energy > 800) {
            var targets_repair = tower.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL});
            targets_repair.sort((a,b) => a.hits - b.hits);
            if (targets_repair.length)
                tower.repair(targets_repair[0]);
        }
        
    }
    
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
        
        
        //Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, CLAIM, WORK, CARRY, MOVE, MOVE, MOVE],'claimer_'+Game.time, {memory: {role: 'claimer'}});
        if (creep.memory.role == 'claimer') {
            //console.log(creep.getObjectById('5bbcad559099fc012e63722e'));
            const route = Game.map.findRoute(creep.room, 'E4S17');
            if(route.length > 0) {
                console.log('Now heading to room '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                //creep.moveTo(49, 38);
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'red', opacity: 0.5}});
            }
            else {
                if(creep.room.controller) {
                    if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'red', opacity: 0.5}});
                    }
                }
            }
        }
        
        let damagerParts = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE];
        //Game.spawns['Spawn1'].spawnCreep(damagerParts, 'damager', {memory: {role: 'damager'}});
        if (creep.memory.role == 'damager') {
            //console.log(creep.getObjectById('5bbcad559099fc012e63722e'));
            const route = Game.map.findRoute(creep.room, 'E7S14');
            if(route.length > 0) {
                console.log('Now heading to room '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'red', opacity: 0.5}});
            }
            else {
                const target_creeps = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);//FIND_HOSTILE_CREEPS
                if(target_creeps != null) {
                    if(creep.attack(target_creeps) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target_creeps, {visualizePathStyle: {stroke: 'red'}});
                    }
                } else {
                    target_spawns = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);//FIND_HOSTILE_CREEPS
                    if(creep.attack(target_spawns) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target_spawns, {visualizePathStyle: {stroke: 'red'}});
                    }
                    target_sturctures = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                        filter: (structure) => { return structure.structureType != 'controller'}
                    });//FIND_HOSTILE_CREEPS
                    console.log(target_sturctures);
                    if(creep.attack(target_sturctures) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target_sturctures, {visualizePathStyle: {stroke: 'red'}});
                    }
                }
            }
        }
        
        
    }
    
}
