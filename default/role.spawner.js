/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.spawner');
 * mod.thing == 'a thing'; // true
 */
 
const builders_countMax = 2;
const harvesters_countMax = 2;
const upgraders_countMax = 3;
const miners_countMax = 5;
const carriers_countMax = 6;
const carriUpgraders_countMax = 1;

const harvesterParts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, CARRY, MOVE,  MOVE];
const builderParts   = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, MOVE,  MOVE,  MOVE];
const upgraderParts  = [WORK, WORK, WORK, WORK,  CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, CARRY, MOVE,  MOVE];
const carrierParts   = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE];
const minerParts     = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
const carriUpgraderParts = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, 
                            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,  MOVE,  MOVE,  MOVE];

module.exports = {
    run: function(spawn) {
        // Удаление старых крипов из памяти
        for (var name in Memory.creeps)
            if (!Game.creeps[name]) DeleteCreepInMemory(name);
        
        var builders_count = 0,
            upgraders_count = 0,
            harvesters_count = 0
            searchers_count = 0,
            miners_count = 0,
            carriers_count = 0,
            carriUpgraders_count = 0;
            
            
        // Подсчет крипов
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester')
                harvesters_count++;
            if(creep.memory.role == 'builder')
                builders_count++;
            if(creep.memory.role == 'upgrader')
                upgraders_count++;
            if(creep.memory.role == 'searcher')
                searchers_count++;
            if(creep.memory.role == 'miner')
                miners_count++;
            if(creep.memory.role == 'carrier')
                carriers_count++;
            if(creep.memory.role == 'carriUpgrader')
                carriUpgraders_count++;
        }
        // Спавн новых если нужно
        if (spawn.spawning == null) {
            //console.log(harvesters_count + " " + builders_count + " " + upgraders_count);
            
            if (searchers_count == 0 && Memory.NoSearchedRooms && Memory.NoSearchedRooms.length > 0) 
                spawn.spawnCreep([MOVE], 'searcher_'+Game.time.toString(), {memory: {role: 'searcher'}});
                
            else if (harvesters_count < harvesters_countMax)
                spawn.spawnCreep(harvesterParts, 'harvester_'+Game.time.toString(), {memory: {role: 'harvester'}});
                
            else if (miners_count < miners_countMax) {
                spawn.spawnCreep(minerParts, 'miner_'+Game.time.toString(), {memory: {role: 'miner'}});
            }
            else if (carriers_count < carriers_countMax) {
                spawn.spawnCreep(carrierParts, 'carrier_'+Game.time.toString(), {memory: {role: 'carrier'}});
            }
            
            else if (upgraders_count < upgraders_countMax)
                spawn.spawnCreep(upgraderParts, 'upgrader_'+Game.time.toString(), {memory: {role: 'upgrader'}});
            
            else if (carriUpgraders_count < carriUpgraders_countMax) {
                spawn.spawnCreep(carriUpgraderParts, 'carriUpgrader_'+Game.time.toString(), {memory: {role: 'carriUpgrader'}});
            }
            
            else if (builders_count < builders_countMax && spawn.room.find(FIND_CONSTRUCTION_SITES).length != 0) {
                spawn.spawnCreep(builderParts, 'builder_'+Game.time.toString(), {memory: {role: 'builder'}});
            }
                
        }
    }
};

function DeleteCreepInMemory(creepName) {
    console.log("Удаление несуществующего крипа из памяти! " + creepName);
    if (Memory.creeps[creepName].role == 'miner') {
        for (var roomName in Memory.rooms) {
            let room = Memory.rooms[roomName];
            let resources = _.filter(room.resources, item => (_.find(item.creeps, creep => creep.name == creepName)));
            Memory.test = resources;
            if (resources)
                resources.forEach(res => res.creeps.splice(_.findIndex(res.creeps, resCreep => resCreep.name == creepName), 1));
        }
    }
    else if (Memory.creeps[creepName].role == 'carrier') {
        for (var roomName in Memory.rooms) {
            let room = Memory.rooms[roomName];
            for (let i in room.carriers) {
                if (room.carriers[i] == creepName) {
                    room.carriers.splice(i, 1);
                    break;
                }
            }
            // if (room.carrier == creepName) {
            //     delete room.carrier;
            // }
        }
    }
    delete Memory.creeps[creepName];
}
