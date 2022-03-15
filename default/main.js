var moduleFraction = require('module.fraction');
var moduleSpawner = require('module.spawner');
var moduleVisualize = require('module.visualize');



var roles = {
    'harvester':        require('role.harvester'),
    'builder':          require('role.builder'),
    'upgrader':         require('role.upgrader'),
    'miner':            require('role.miner'),
    'transporter':      require('role.transporter'),
    'searcher':         require('role.searcher'),
    'carrier':          require('role.carrier'),
    'reserver':         require('role.reserver'),
    'carriUpgrader':    require('role.carriUpgrader'),

    'dismantle':    require('role.dismantle'),
    'claimer':      require('role.claimer')
};
var roleTower = require('role.tower');
var moduleCreep = require('module.creep');


//var roleMiner = require('role.miner');
//var moduleRoom = require('module.room');

const roomNames = ['W7S33'];  // 'E2S17'



/*
    обычным названием обзываем только object пример: room = Game.rooms['name']
*/




module.exports.loop = function () {
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    // moduleVisualize.showGrid(Game.rooms['W42N4']);
    moduleCreep.setPrototypes();

    // --------- ROOMS
    roomNames.forEach(nameRoom => {
        moduleFraction.run();
    });
    
    
    // --------- TOWER
    _.forEach(['617b25e6b96f3704d72453d6', '6181d0fcd1a7a39b50df1234', '618e07fe3bcc8b6e0c5f26c9',
                '61841302f62b40394922815d', '618a902264b94738451fedaa'], towerId => {
        var tower = Game.getObjectById(towerId);
        if(tower) {
            roleTower.run(tower);
        }
    });
    



    // --------- SPAWN
    moduleSpawner.deleteOldCreeps();
    // if (Game.rooms['W44N1'] && Game.rooms['W44N1'].memory) {

    //     if (Game.rooms['W44N1'].memory.timeToGoClaimer === undefined
    //     || (Game.spawns['Spawn1'].spawning 
    //     && Game.creeps[Game.spawns['Spawn1'].spawning.name].memory .role == 'claimer'))
    //         Game.rooms['W44N1'].memory.timeToGoClaimer = 0;
            
    //     else Game.rooms['W44N1'].memory.timeToGoClaimer = Game.rooms['W44N1'].memory.timeToGoClaimer+1;

    //     if (Game.rooms['W44N1'].memory.timeToGoClaimer > 500) {
    //         // console.log('spawn');
    //         Game.spawns['Spawn1'].spawnCreep([...(new Array(10).fill(WORK)), 
    //                 ...(new Array(6).fill(CARRY)), ...(new Array(16).fill(MOVE))], 'claimer');
    //     }
    // }
    // Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE], 'claimer');
    // Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE], 'claimer');
    for(var name in Game.spawns)
        // if (name != 'Spawn1')
        moduleSpawner.run(Game.spawns[name]);

    // Game.spawns['Spawn2'].spawnCreep([...(new Array(25).fill(ATTACK)), ...(new Array(25).fill(MOVE))], 'attack');
    // Game.spawns['W42N4_2'].spawnCreep([...(new Array(25).fill(ATTACK)), ...(new Array(25).fill(MOVE))], 'attack');
    
    
    // Game.spawns['Spawn2'].spawnCreep([...(new Array(10).fill(TOUGH)), ...(new Array(10).fill(MOVE))], 'big');
    // Game.spawns['W42N4_2'].spawnCreep([...(new Array(10).fill(TOUGH)), ...(new Array(10).fill(MOVE))], 'big');
    
    // Game.spawns['Spawn1'].spawnCreep([...(new Array(10).fill(ATTACK)), 
    //         ...(new Array(10).fill(MOVE)), CLAIM, MOVE], 'claimer');
    // Game.spawns['Spawn1'].spawnCreep([...(new Array(10).fill(WORK)), 
    //         ...(new Array(6).fill(CARRY)), ...(new Array(16).fill(MOVE))], 'claimer');




    // --------- CREEPS
    for(var name in Game.creeps) {
        
        var creep = Game.creeps[name];
        if (roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
            continue;
        }
        if (creep.memory.role == 'attack') {
            let route = Game.map.findRoute(creep.room, 'W42N5');
            if(route && route.length > 0) {
                let exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'red'}});
            } else {
                let target_spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);//FIND_HOSTILE_CREEPS
                creep.attack(target_spawn);
                let target = Game.getObjectById('617fa225b05295810aae1da7');
                if (target) {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
                } else if(target_spawn) {
                    if (creep.attack(target_spawn) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target_spawn, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
                }
            }
        }
        if (creep.memory.role == 'big') {
            let route = Game.map.findRoute(creep.room, 'W43N5');
            if(route && route.length > 0) {
                let exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'red'}});
            } else {
                creep.moveTo(15, 4, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
                // creep.moveTo(16, 48, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});

                let target_spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);//FIND_HOSTILE_CREEPS
                creep.attack(target_spawn);
                let target = Game.getObjectById('619569eb6f91e778c1266cf3');
                if (target) {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
                } else if(target_spawn) {
                    if (creep.attack(target_spawn) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target_spawn, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
                }
            }
        }
    }

    
    

}
