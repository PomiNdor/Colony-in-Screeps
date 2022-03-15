/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.spawner');
 * mod.thing == 'a thing'; // true
 */
 


module.exports = {
    run: function(spawn) {
        
        let rootRoomMemory;
        for(let i in Memory.rootRooms)
            if (Memory.rootRooms[i].name == spawn.room.name) {
                rootRoomMemory = Memory.rootRooms[i];
                break;
            }
        if (!rootRoomMemory) {
            console.log("Ошибки считывания памяти комнаты ", spawn.room.name);
            return;
        }
        
        const harvesters_countMax     = rootRoomMemory.creeps.harvesters_countMax;
        const upgraders_countMax      = rootRoomMemory.creeps.upgraders_countMax;
        const builders_countMax       = rootRoomMemory.creeps.builders_countMax;
        const miners_countMax         = rootRoomMemory.creeps.miners_countMax;
        const carriers_countMax       = rootRoomMemory.creeps.carriers_countMax;
        const carriUpgraders_countMax = rootRoomMemory.creeps.carriUpgraders_countMax;
        const transporters_countMax   = rootRoomMemory.creeps.transporters_countMax;
        
        const harvesterParts     = rootRoomMemory.creeps.harvesterParts;
        const upgraderParts      = rootRoomMemory.creeps.upgraderParts;
        const builderParts       = rootRoomMemory.creeps.builderParts;
        const minerParts         = rootRoomMemory.creeps.minerParts;
        const carrierParts       = rootRoomMemory.creeps.carrierParts;
        const carriUpgraderParts = rootRoomMemory.creeps.carriUpgraderParts;
        const transporterParts   = rootRoomMemory.creeps.transporterParts;
        
        
        
        
        
        // Удаление старых крипов из памяти
        for (var name in Memory.creeps)
            if (!Game.creeps[name]) DeleteCreepInMemory(name);
        
        var builders_count = 0,
            upgraders_count = 0,
            harvesters_count = 0,
            searchers_count = 0,
            miners_count = 0,
            carriers_count = 0,
            carriUpgraders_count = 0,
            reservers_count = 0,
            transporters_count = 0;
            // testCarry_count = 0;
            
            
        // Подсчет крипов
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            let creepIsThisRooms = creep.room.name == spawn.room.name;
            
            // if (creep.memory.role == 'testCarry') 
            //     testCarry_count++;
                
            for (let i in rootRoomMemory.miningRooms)
                if (creep.room.name == rootRoomMemory.miningRooms[i])
                    creepIsThisRooms = true;
            
            if (!creepIsThisRooms) continue;
            
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
            if(creep.memory.role == 'reserver')
                reservers_count++;
            if(creep.memory.role == 'transporter')
                transporters_count++;
                
        }
        // if (spawn.name == 'Spawn2') {
            
        // console.log('harvesters_count ',harvesters_count, " ", harvesters_countMax);
        // console.log('builders_count ',builders_count, " ", builders_countMax, " ", builderParts);
        // console.log('upgraders_count ',upgraders_count, " ", upgraders_countMax);
        // console.log('searchers_count ',searchers_count, " ", 0);
        // console.log('miners_count ',miners_count, " ", miners_countMax);
        // console.log('carriers_count ',carriers_count, " ", carriers_countMax);
        // console.log('carriUpgraders_count ',carriUpgraders_count, " ", carriUpgraders_countMax);
        // console.log('ddd ', (builders_count < builders_countMax && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0));
        // }
        
        //console.log(miners_count, ' ', miners_countMax);
        // Спавн новых если нужно
        
        // TestCarryParts
        let carryParts = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
                          MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE];
        
        if (spawn.spawning == null) {
            //console.log(harvesters_count + " " + builders_count + " " + upgraders_count);
            // if (spawn.name == 'Spawn2' && testCarry_count < 2)
            //     SpawnCreep(spawn, carryParts, 'testCarry');
            
            
            if (searchers_count == 0 && rootRoomMemory.NoSearchedRooms && rootRoomMemory.NoSearchedRooms.length > 0) 
                SpawnCreep(spawn, [MOVE], 'searcher');
                
            else if (transporters_count < transporters_countMax)
                SpawnCreep(spawn, transporterParts, 'transporter');
                
            else if (harvesters_count < harvesters_countMax)
                SpawnCreep(spawn, harvesterParts, 'harvester');
                
            // else if (spawn.name == 'Spawn1' && reservers_count == 0)
            //     SpawnCreep(spawn, [CLAIM, CLAIM, MOVE, MOVE], 'reserver');
                
            else if (miners_count < miners_countMax) 
                SpawnCreep(spawn, minerParts, 'miner');
            
            else if (carriers_count < carriers_countMax) 
                SpawnCreep(spawn, carrierParts, 'carrier');
            
            else if (upgraders_count < upgraders_countMax)
                SpawnCreep(spawn, upgraderParts, 'upgrader');
                
            else if (builders_count < builders_countMax && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0)
                SpawnCreep(spawn, builderParts, 'builder');
            
            else if (carriUpgraders_count < carriUpgraders_countMax && (
                (spawn.room.storage && spawn.room.storage.store[RESOURCE_ENERGY] >= 30000) 
                || (spawn.room.terminal && spawn.room.terminal.store[RESOURCE_ENERGY] >= 100000)))
                SpawnCreep(spawn, carriUpgraderParts, 'carriUpgrader');
                
            
        }
    }
};

function SpawnCreep(spawn, _parts, _role) {
    spawn.spawnCreep( _parts, _role+'_'+Game.time.toString(), { memory: {role: _role, rootRoomName: spawn.room.name }} );
}


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
