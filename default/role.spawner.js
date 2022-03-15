/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.spawner');
 * mod.thing == 'a thing'; // true
 */
 
const builders_countMax = 3;
const harvesters_countMax = 2;
const upgraders_countMax = 1;

const harvesterParts = [WORK, CARRY, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, CARRY, MOVE,  MOVE];
const builderParts   = [WORK, CARRY, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, MOVE,  MOVE,  MOVE];
const upgraderParts  = [WORK, CARRY, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, CARRY, MOVE,  MOVE];

module.exports = {
    run: function(spawn) {
        // Удаление старых крипов из памяти
        for (var name in Memory.creeps)
            if (!Game.creeps[name]) DeleteCreepInMemory(name);
        
        var builders_count = 0,
            upgraders_count = 0,
            harvesters_count = 0;
            
            
        // Подсчет крипов
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester')
                harvesters_count++;
            if(creep.memory.role == 'builder')
                builders_count++;
            if(creep.memory.role == 'upgrader')
                upgraders_count++;
        }
        
        // Спавн новых если нужно
        if (spawn.spawning == null) {
            //console.log(harvesters_count + " " + builders_count + " " + upgraders_count);
            if (harvesters_count < harvesters_countMax)
                spawn.spawnCreep(harvesterParts, 'harvester_'+Game.time.toString(), {memory: {role: 'harvester'}});
                
            else if (upgraders_count < upgraders_countMax)
                spawn.spawnCreep(upgraderParts, 'upgrader_'+Game.time.toString(), {memory: {role: 'upgrader'}});
                
            else if (builders_count < builders_countMax) {
                if (spawn.room.find(FIND_CONSTRUCTION_SITES).length != 0)
                    spawn.spawnCreep(builderParts, 'builder_'+Game.time.toString(), {memory: {role: 'builder'}});
            }
                
            
            
        }
    }
};

function DeleteCreepInMemory(creepName) {
    console.log("Удаление несуществующего крипа из памяти! " + creepName);
    if (Memory.creeps[creepName].role == 'miner') 
        for (var roomName in Memory.rooms) {
            let room = Memory.rooms[roomName];
            let resources = _.filter(room.resources, item => (_.find(item.creeps, creep => creep.name == creepName)));
            Memory.test = resources;
            if (resources)
                resources.forEach(res => res.creeps.splice(_.findIndex(res.creeps, resCreep => resCreep.name == creepName), 1));
        }
    delete Memory.creeps[creepName];
}
