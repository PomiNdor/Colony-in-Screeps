var moduleFunctions = require('module.functions');
var roles = {
    'builder': require('role.builder'),
    'upgrader': require('role.upgrader'),
    'miner': require('role.miner')
};

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.spawning) return;
        creep.CheсkStatus('storing');
        // if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
        //     creep.memory.harvesting = false;
        //     creep.say('🗳️ store');
	    // }
	    // if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
	    //     creep.memory.harvesting = true;
	    //     creep.say('⛏︎ harvest');
	    // }
        
        
	    if(!creep.memory.storing) {
            let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: target => target.resourceType == RESOURCE_ENERGY && target.amount > 100}); // не тестил
            let target_tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил
            let target_ruins = creep.pos.findClosestByRange(FIND_RUINS, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил
            let target_container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
                return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity();
            }});

            if (target_resource) {
                if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_resource, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else if (target_tombstone) {
                if(creep.withdraw(target_tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_tombstone, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            } else if (target_ruins) {
                if(creep.withdraw(target_ruins, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_ruins, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            } else if (target_container) {
                if(creep.withdraw(target_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_container, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    
            } else {
                var sources = creep.room.find(FIND_SOURCES_ACTIVE); //creep.room.find(FIND_SOURCES_ACTIVE);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            let targets_spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            let towers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                        return  structure.structureType == STRUCTURE_TOWER &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            towers.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
            
            let storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                        return  structure.structureType == STRUCTURE_STORAGE &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            
            if(targets_spawn) {
                if(creep.transfer(targets_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets_spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < 700) {
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if(towers.length > 0) {
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (storage.length > 0) {
                if(creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                if (creep.store.getUsedCapacity() == 0)
                    creep.memory.storing = false;
                else {

                    // Строители не нужны если нечего строить
                    if (creep.room.find(FIND_CONSTRUCTION_SITES).length != 0)
                        roles['builder'].run(creep);
                    else roles['upgrader'].run(creep);
                    // Отдых
                    // let fraction = moduleFunctions.FindFractionMemory(creep.room.name);
                    // if (fraction && fraction.restPoint)
                    //     creep.moveTo(fraction.restPoint.x, fraction.restPoint.y, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;



function CreepInObjectRadius(creep, object, radius = 1) {
    let x = creep.pos.x - object.pos.x;
    let y = creep.pos.y - object.pos.y;
    return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
}