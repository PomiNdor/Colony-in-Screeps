/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.squad');
 * mod.thing == 'a thing'; // true
 */

// 5 - 1800
// 1500 + 300 = 1800
const partsHeal2s2 = [...(new Array(6).fill(MOVE)), ...(new Array(6).fill(HEAL))];
// 100 + 300 + 500 + 800 = 1700
// const partsDamagers2 = [...(new Array(2).fill(MOVE)), 
//                         ...(new Array(2).fill(RANGED_ATTACK)), 
//                         ...(new Array(12).fill(MOVE)),    
//                         ...(new Array(10).fill(ATTACK))]; 
// 1350 + 450 = 1800
const partsDamagers2 = [...(new Array(9).fill(MOVE)), 
                        ...(new Array(9).fill(RANGED_ATTACK))];

// 6 - 2300

// 150 + 150 + 800 + 1200 = 2300
const partsDamager = [...(new Array(3).fill(MOVE)), 
                      ...(new Array(1).fill(RANGED_ATTACK)), 
                      ...(new Array(16).fill(MOVE)), 
                      ...(new Array(15).fill(ATTACK))];
// 30 + 1750 + 500 = 2280
const partsHeal1 = [...(new Array(3).fill(TOUGH)), ...(new Array(7).fill(HEAL)), ...(new Array(10).fill(MOVE))];
// 150 + 1750 + 400 = 2300
const partsHeal2 = [...(new Array(1).fill(RANGED_ATTACK)), ...(new Array(8).fill(MOVE)), ...(new Array(7).fill(HEAL))];

module.exports = {
    actualize: function(spawn) {
        if (!Memory.squad) {
            Memory.squad = {
                damagersId: [],
                healersId: [],
                movePosition: new RoomPosition(6, 7, spawn.room.name),
                attack: false,
                attackRoom: false,
                // targetPosition,
                // targetId = '60e5284f9891317e1003e29c'
            }
            return;
        }
        Memory.squad.damagersId = [];
        Memory.squad.healersId = [];
        Memory.squad.attack = false;
        Memory.squad.attackRoom = false;
        for (creepName in Game.creeps) {
            let creep = Game.creeps[creepName];
            if (creep.memory.role == 'squad_damager')
                Memory.squad.damagersId.push(creep.id);
            else if (creep.memory.role == 'squad_healer')
                Memory.squad.healersId.push(creep.id);
        }
        // Memory.squad.movePosition = new RoomPosition(28, 42, 'E2S16'); //spawn.room.name);
        // Memory.squad.movePosition = new RoomPosition(48, 36, 'E3S16'); //spawn.room.name);
        // Memory.squad.movePosition = new RoomPosition(6, 46, 'E4S16'); //spawn.room.name);
        // Memory.squad.movePosition = new RoomPosition(27, 13, 'E4S17'); //spawn.room.name);
        // Memory.squad.movePosition = new RoomPosition(10, 48, 'E4S17'); //spawn.room.name);
        
        // Memory.squad.movePosition = new RoomPosition(8, 15, 'E4S18'); //spawn.room.name);
        // Memory.squad.movePosition = new RoomPosition(4, 34, 'E4S18'); //spawn.room.name);  
        // Memory.squad.movePosition = new RoomPosition(47, 36, 'E3S18'); //spawn.room.name); слева
        // Memory.squad.attackRoom = true;
        
        // Memory.squad.movePosition = new RoomPosition(15, 47, 'E4S18'); //spawn.room.name);
        Memory.squad.movePosition = new RoomPosition(15, 2, 'E4S19'); //spawn.room.name);
        // Memory.squad.movePosition = new RoomPosition(28, 17, 'E4S19'); //spawn.room.name);
        
        
        
        Memory.squad.movePosition = new RoomPosition(25, 26, 'E4S19'); //spawn.room.name);
        
        
        // Memory.squad.movePosition = new RoomPosition(17, 8, 'E4S19'); //spawn.room.name);
        
        // 60e528533915ad0ef15c2413
        // Memory.squad.attack = true;
        // Memory.squad.targetId = '60e43f4fd315ecc01b65fd8e'; // 60f0349d5b87baa4ca2b8ccf link 60e43f4fd315ecc01b65fd8e spawn
        
        // Memory.squad.attackRoom = false;
        // Memory.squad.targetPosition = new RoomPosition(6, 7, spawn.room.name);
        
    },
    spawning: function(spawn) {
        if (!Memory.squad)
        Memory.squad = {
            damagersId: [],
            healersId: [],
            movePosition: new RoomPosition(7,7, spawn.room.name),
            attack: false,
            attackRoom: false
            // targetPosition,
            // targetId
        }
        if (spawn.name == 'Spawn1') {
            if (Memory.squad.damagersId.length < 1) {
                spawn.spawnCreep(partsDamager, 'damager_'+Game.time, {memory: {role: 'squad_damager'}});
            } else if (Memory.squad.healersId.length < 4) {
                spawn.spawnCreep(partsHeal2, 'healer_'+Game.time, {memory: {role: 'squad_healer'}});
            }
        } else {
            if (Memory.squad.damagersId.length < 2) {
                spawn.spawnCreep(partsDamagers2, 'damager_'+Game.time, {memory: {role: 'squad_damager'}});
            } else if (Memory.squad.healersId.length < 6) {
                spawn.spawnCreep(partsHeal2s2, 'healer_'+Game.time, {memory: {role: 'squad_healer'}});
            }
        }
        
        
    },
    run: function() {
        // if (!squad.targetId && squad.targetPosition) 
        let target;
        if (Memory.squad.targetId) target = Game.getObjectById(Memory.squad.targetId);
        // console.log(target);
        for (creepName in Game.creeps) {
            let creep = Game.creeps[creepName];
            if (creep.memory.role.includes('squad')) {
                let arr = ['damager_29826159', 'healer_29826264', 'damager_29826433', 'damager_29826173', 'healer_29826346', 'healer_29826444']
                // for (let i in arr)
                //     Game.creeps[arr[i]].move(BOTTOM);
                    
                // console.log('aaaaa');
                if (!Memory.squad.attack && !Memory.squad.attackRoom && creep.pos != Memory.squad.movePosition) { // && !Memory.squad.attackRoom 
                    creep.moveTo(new RoomPosition(Memory.squad.movePosition.x, 
                                                  Memory.squad.movePosition.y, 
                                                  Memory.squad.movePosition.roomName),
                                {visualizePathStyle: {stroke: 'white'}});
                }
                    
            }
            
            if (creep.memory.role == 'squad_healer') {
                if (Memory.squad.damagersId && Memory.squad.damagersId.length > 0) {
                    let defender = Game.getObjectById(Memory.squad.damagersId[0]);
                    creep.moveTo(defender);
                }
                
                let hostileCreep =  creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (hostileCreep) creep.rangedAttack(hostileCreep);
                
                if (creep.hits < creep.hitsMax) creep.heal(creep);
                else {
                    let damageCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: fCreep => fCreep.hits < fCreep.hitsMax});
                    if (damageCreep) {
                        creep.pull(damageCreep);
                        creep.heal(damageCreep);
                        creep.rangedHeal(damageCreep);
                    }
                }
            } else if (creep.memory.role == 'squad_damager') {
                let target__ = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target__) creep.attack(target__);
                
                if (Memory.squad.attack) {
                    if (target) {
                        creep.say('Attack target');
                        if (creep.attack(target) == ERR_NOT_IN_RANGE) 
                            creep.moveTo(target, {visualizePathStyle: {stroke: 'red'}});
                            
                        if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) 
                            creep.moveTo(target, {visualizePathStyle: {stroke: 'red'}});
                            
                    } else if (Memory.squad.targetPosition) {
                        creep.say('Attack pos');
                        creep.moveTo(new RoomPosition(Memory.squad.targetPosition.x,
                                                      Memory.squad.targetPosition.y,
                                                      Memory.squad.targetPosition.roomName)
                                    , {visualizePathStyle: {stroke: 'red'}});
                    } else {
                        creep.moveTo(new RoomPosition(Memory.squad.movePosition.x,
                                                      Memory.squad.movePosition.y,
                                                      Memory.squad.movePosition.roomName)
                                    , {visualizePathStyle: {stroke: 'red'}});
                    }
                } else if (Memory.squad.attackRoom) {
                    creep.say('Attack room');
                    let hostileCreep =  creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (hostileCreep) 
                        if (creep.attack(hostileCreep) == ERR_NOT_IN_RANGE)
                            creep.moveTo(hostileCreep, {visualizePathStyle: {stroke: 'red'}});
                            
                        if (creep.rangedAttack(hostileCreep) == ERR_NOT_IN_RANGE)
                            creep.moveTo(hostileCreep, {visualizePathStyle: {stroke: 'red'}});
                }
                
            }
        }
        
        
    }
    
};