var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('🗳️ store');
	    }
	    if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
	        creep.memory.harvesting = true;
	        creep.say('⛏︎ harvest');
	    }
        
        
	    if(creep.memory.harvesting) {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE); //creep.room.find(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
                if (creep.store.getFreeCapacity() > 0)
                    creep.memory.harvesting = true;
                else {
                    let rootRoom = FindRootRoom(creep.room.name);
                    if (rootRoom && rootRoom.creeps.restPoint)
                        creep.moveTo(rootRoom.creeps.restPoint.x, rootRoom.creeps.restPoint.y, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;

function FindRootRoom(roomName) {
    for (let i in Memory.rootRooms) { 
        if (Memory.rootRooms[i].name == roomName)
            return Memory.rootRooms[i];
    }
}