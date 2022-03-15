
let roleHarvester = require('role.harvester');
let roleBuilder =   require('role.builder');
let roleUpgrader =  require('role.upgrader');
let roleCarriUpgrader =  require('role.carriUpgrader');
let roleSpawner =   require('role.spawner');

let roleMiner =     require('role.miner');
let roleSearcher =  require('role.searcher');
let roleCarrier =   require('role.carrier');
let roleDamager =   require('role.damager');
let roleTower =     require('role.tower');
let roleTransporter =  require('role.transporter');
let roleReserver = require('role.reserver');

let roleDepositMiner = require('role.depositMiner');
let roleChemist = require('role.chemist');
// E4S17

let moduleRoom = require('module.room');
let moduleSquad = require('module.squad');
var moduleVisualize = require('module.visualize');



module.exports.loop = function () {
    // console.log(Game.cpu.bucket);
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    // ResetRoles();


    // moduleVisualize.showGrid(Game.rooms['E4S17']);

    // moduleSquad.actualize(Game.spawns['Spawn1']);
    // moduleSquad.spawning(Game.spawns['Spawn1']);
    // moduleSquad.spawning(Game.spawns['Spawn2']);
    // moduleSquad.run();
    
    // Game.creeps['carrier_29573682'].moveTo(43, 25);
    //Game.creeps['carrier_29574074'].move(BOTTOM);
    //Game.creeps['carrier_29573682'].moveTo(44, 21);
    
    // --------- ROOMS
    moduleRoom.run();
    //Game.creeps['test_29542779'].moveTo(18, 48);
    
    // --------- SPAWN
    for(var name in Game.spawns)
        // if (name != 'Spawn1')
        roleSpawner.run(Game.spawns[name]);
    
    
    // --------- LINK
    let linksRoom = [
        { storage_linkId: '60eeda81c2c5a996ce82fff8', controller_linkId: '60e3a51f7e4e8db256c215b0' },
        { storage_linkId: '60ed9f9537db5403dddf77f5', controller_linkId: '60edb85c0281ea05f157f27f' }
    ];

    for (let i in linksRoom) {
        let storage_link = Game.getObjectById(linksRoom[i].storage_linkId);
        let controller_link = Game.getObjectById(linksRoom[i].controller_linkId);
        if (controller_link && storage_link && controller_link.store[RESOURCE_ENERGY] == 0 && storage_link.store[RESOURCE_ENERGY]) {
            storage_link.transferEnergy(controller_link);
        }
    }

    // --------- LAB
    let lab = Game.getObjectById('60e919abd48723af15454413');
    if (lab) {
        if (lab.store['XGH2O']) {
            let creep = lab.pos.findClosestByRange(FIND_MY_CREEPS, {filter: creep => creep.memory.role == 'carriUpgrader'});
            if (creep && CreepInObjectRadius(creep, lab)) {
                lab.boostCreep(creep);
            }
        }
    }
    
    // --------- TOWER
    _.forEach(['60e01b8ce63ac4823ee239fc', '60e390b7e23798720459b086', '60f778492f340dfc6c281d1f', 
    '60e640959ce544f9aa0d90d6', '60edabefa2303239febe6f16', '60f44176d6c651ec37390785'], towerId => {
        var tower = Game.getObjectById(towerId);
        if(tower) roleTower.run(tower);
    });
    
    // --------- CREEPS

    for(var name in Game.creeps) {
        
        var creep = Game.creeps[name];
        


        if (creep.memory.role == 'trt') {
            let storage = Game.getObjectById('60f7f1cd31bbfe90785bd661');
            if (creep.store.getFreeCapacity() > 0 && storage) {
                
                for (let resName in storage.store) {
                    if(creep.withdraw(storage, resName) == ERR_NOT_IN_RANGE)
                        creep.moveTo(storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (creep.store.getFreeCapacity() == 0 ) {
                for (let resName in creep.store) {
                    if (creep.transfer(creep.room.terminal, resName) == ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }








        if (creep.memory.role == 'harvester')
            roleHarvester.run(creep);
            
        if (creep.memory.role == 'builder')
            roleBuilder.run(creep);

        if (creep.memory.role == 'upgrader')
            roleUpgrader.run(creep);

        if (creep.memory.role == 'miner')
            roleMiner.run(creep);
            

        if (creep.memory.role == 'carrier')
            roleCarrier.run(creep);
            
        if (creep.memory.role == 'searcher')
            roleSearcher.run(creep);

        if (creep.memory.role == 'transporter')
            roleTransporter.run(creep);

        if(creep.memory.role == 'carriUpgrader')
            roleCarriUpgrader.run(creep);

        if (creep.memory.role == 'damager') {
            roleDamager.run(creep);
            if (creep.memory.rootRoomName == 'E2S17' && !creep.spawning && Game.time - Memory.ticksAttack1 > 1700) 
                Memory.ticksAttack1 = Game.time;
            if (creep.memory.rootRoomName == 'E4S17' && !creep.spawning && Game.time - Memory.ticksAttack2 > 1700) 
                Memory.ticksAttack2 = Game.time;  
        }
            
        if (creep.memory.role == 'depositMiner')
            roleDepositMiner.run(creep);
        
        if (creep.memory.role == 'reserver')
            roleReserver.run(creep);

        if (creep.memory.role == 'chemist')
            roleChemist.run(creep);
            


        // if (creep.memory.role == 'mover') {
        //     if (creep.room.name != 'E4S19') {
        //         creep.say('E4S19');
        //         creep.moveTo(22, 26, 'E4S19');
        //     }
        //     else {
        //         let positions = [
        //             {x: 22, y: 26},
        //             {x: 23, y: 25},
        //             {x: 21, y: 25},
        //             {x: 21, y: 27},

        //             {x: 26, y: 25}, // спавн
        //             {x: 25, y: 26},
        //             {x: 26, y: 24},
        //             {x: 27, y: 24},

        //             {x: 22, y: 24}, // верх
        //             {x: 21, y: 24},
        //             {x: 23, y: 24},

        //             {x: 22, y: 28}, // низ
        //             {x: 21, y: 28},
        //             {x: 23, y: 28},
        //         ];


        //     }
        // }






        
        
        // Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE, MOVE, MOVE],'claimer_'+Game.time, {memory: {role: 'claimer'}});
        // Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],'claimer_'+Game.time, {memory: {role: 'claimer'}});
        if (creep.memory.role == 'claimer') {
            //console.log(creep.getObjectById('5bbcad559099fc012e63722e'));
            const route = Game.map.findRoute(creep.room, 'E3S16'); // E1S16 E2S16
            
            if(route.length > 0) {
                // console.log('Now heading to room '+route[0].room);
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
                if (creep.pos.x != 9 && creep.pos.y != 40) creep.moveTo(9, 40);
                else creep.memory.role = 'builder';
                
                // if(creep.room.controller) {
                //     if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'purple', opacity: 0.5}});
                //     }
                // }
            }
        }
        
        
        


        // Game.spawns['Spawn1'].spawnCreep([...(new Array(23).fill(CARRY)), ...(new Array(23).fill(MOVE))], 
        // 'carry_'+Game.time, {memory: {role: 'testCarry', rootRoomName: 'E2S17'}});

        // W0S10
        // Game.creeps['carrier_29841740'].drop(RESOURCE_ENERGY);
        // 
        if (creep.memory.role == 'testCarry') {
            if (creep.memory.storing === undefined) creep.memory.storing = false;
            if (creep.memory.storing && creep.store.getUsedCapacity() == 0)
                creep.memory.storing = false;
            if (!creep.memory.storing && (creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 500))
                creep.memory.storing = true;
                
            let route;
            if (!creep.memory.storing) {
                if (creep.room.name == 'E2S17' || creep.room.name == 'E1S17' || creep.room.name == 'E1S16') 
                    route = Game.map.findRoute(creep.room, 'E0S16');
                else if (creep.room.name == 'W0S10') {


                    let target_resource// = Game.getObjectById('60f607f560dbca333a72af95');
                    = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    // if (target_resource) console.log(target_resource.amount);
                    let target_tombstone// = Game.getObjectById('60f608d93ec8057c161796c8');
                    = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: target => target.store.getUsedCapacity() > 0}); // не тестил
                    // console.log(creep.room.name, target_tombstone);

                    // creep.moveTo(39, 31);

                    if (target_resource) {
                        if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                            creep.moveTo(target_resource, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            
                    } else if (target_tombstone) {
                        for (let resName in target_tombstone.store) {
                            if(creep.withdraw(target_tombstone, resName) == ERR_NOT_IN_RANGE)
                                creep.moveTo(target_tombstone, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                } 
                else
                    route = Game.map.findRoute(creep.room, 'W0S10');


            } else {
                if (creep.room.name == 'W0S16') {
                    route = Game.map.findRoute(creep.room, 'E0S16');

                } else if (creep.room.name == 'E0S16') {
                    route = Game.map.findRoute(creep.room, 'E1S16');

                } else if (creep.room.name == 'E1S17' || creep.room.name == 'E1S16') {
                    route = Game.map.findRoute(creep.room, 'E2S17');

                } else if (creep.room.name == 'E2S17') {
                    creep.memory.role = 'transporter';
                } else {
                    route = Game.map.findRoute(creep.room, 'E0S16');
                }
            }
            if(route && route.length > 0) {
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'green', opacity: 0.5}});
            }
        }
        
        // Game.spawns['Spawn2'].spawnCreep([...(new Array(10).fill(CARRY)), 
        //     ...(new Array(10).fill(MOVE))], 'carry_'+Game.time, {memory: {role: 'test', rootRoomName: 'E4S17'}});
        if (creep.memory.role == 'test') {

            if (creep.memory.storing === undefined) 
                creep.memory.storing = false;
            if (!creep.memory.storing && creep.store.getFreeCapacity() == 0)
                creep.memory.storing = true;
            if (creep.memory.storing && creep.store.getUsedCapacity() == 0)
                creep.memory.storing = false;

            if (!creep.memory.storing) {
                if (creep.room.name != 'E4S19')
                    creep.moveTo(new RoomPosition(27, 48, 'E4S19'));
                else {
                    let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    // if (target_resource) console.log(target_resource.amount);
                    let target_tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: target => target.store.getUsedCapacity() > 0}); // не тестил
                    // console.log(creep.room.name, target_tombstone);
                    let target_container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 100;
                    }});

                    if (target_resource) {
                        if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                            creep.moveTo(target_resource, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            
                    } else if (target_tombstone) {
                        if(creep.withdraw(target_tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            creep.moveTo(target_tombstone, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            
                    } else if (target_container) {
                        if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            creep.moveTo(target_container, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            
                    } else if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY]) {
                        if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            
                    } else if (creep.room.terminal && creep.room.terminal.store.getUsedCapacity() > 0) {
                        for (let i in creep.room.terminal.store) {
                            if(creep.withdraw(creep.room.terminal, i) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                                break;
                            } 
                        }
                    } else {
                        creep.memory.storing = true;
                    }
                }
            } else {
                if (creep.room.name != 'E4S17')
                    creep.moveTo(new RoomPosition(25, 25, 'E4S17'));
                else {
                    if (creep.store.getUsedCapacity() > 0) {
                        if (creep.room.terminal && creep.room.terminal.store.getFreeCapacity() > 0) {
                            for(let res in creep.store) {
                                if(creep.transfer(creep.room.terminal, res) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                                    break;
                                }
                            }
                        } else if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
                            for(let res in creep.store) {
                                if(creep.transfer(creep.room.storage, res) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            



        }

        
        
    }

    let damagerParts = [...(new Array(10).fill(ATTACK)), ...(new Array(10).fill(MOVE))];
    // let damagerParts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    // let damagerParts = [...(new Array(6).fill(MOVE)), ...(new Array(6).fill(HEAL))];

    let damagerRootE2S17 = false;
    let damagerRootE4S17 = false;
    for (let i in Game.creeps) {
        let creep = Game.creeps[i];
        if (creep.memory.role == 'damager') {
            if (creep.memory.rootRoomName == 'E2S17')
                damagerRootE2S17 = true;
            else if (creep.memory.rootRoomName == 'E4S17')
                damagerRootE4S17 = true;
        }
    }
    if (!damagerRootE2S17 && Game.rooms['E2S16'] && Game.rooms['E2S16'].find(FIND_HOSTILE_STRUCTURES))
        Game.spawns['E2S17 S2'].spawnCreep(damagerParts, 'damager_'+Game.time, {memory: {role: 'damager', rootRoomName: 'E2S17'}});
    if (!damagerRootE4S17 && Game.rooms['E4S18'] && Game.rooms['E4S18'].find(FIND_HOSTILE_STRUCTURES))
        Game.spawns['Spawn2'].spawnCreep(damagerParts, 'damager_'+Game.time, {memory: {role: 'damager', rootRoomName: 'E4S17'}});   
  
}


function CreepInObjectRadius(creep, object, radius = 1) {
    let x = creep.pos.x - object.pos.x;
    let y = creep.pos.y - object.pos.y;
    return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
}


function ResetRoles() {
    for(var name in Game.creeps) {
        
        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester' || creep.name.includes('harvester')) {
            creep.memory.role = 'harvester';
        }
            
        if (creep.memory.role == 'builder' || creep.name.includes('builder')) {
            creep.memory.role = 'builder';
        }
        if (creep.memory.role == 'upgrader' || creep.name.includes('upgrader')) {
            creep.memory.role = 'upgrader';
        }
        if (creep.memory.role == 'miner' || creep.name.includes('miner')) {
            creep.memory.role = 'miner';
        }

        if (creep.memory.role == 'carrier' || creep.name.includes('carrier')) {
            creep.memory.role = 'carrier';
            roleCarrier.run(creep);
        }
        if (creep.memory.role == 'searcher' || creep.name.includes('searcher')) {
            creep.memory.role = 'searcher';
        }
        if (creep.memory.role == 'transporter' || creep.name.includes('transporter')) {
            creep.memory.role = 'transporter';
        }
        if(creep.memory.role == 'carriUpgrader' || creep.name.includes('carriUpgrader')) {
            creep.memory.role = 'carriUpgrader';
        }
        if (creep.memory.role == 'damager' || creep.name.includes('damager')) {
            creep.memory.role = 'damager';
        }
            
        if (creep.memory.role == 'depositMiner' || creep.name.includes('depositMiner')) {
            creep.memory.role = 'depositMiner';
        }
        
        if (creep.memory.role == 'reserver' || creep.name.includes('reserver')) {
            creep.memory.role = 'reserver';
        }
        if (creep.memory.role == 'chemist' || creep.name.includes('chemist')) {
            creep.memory.role = 'chemist';
        }
    }
}