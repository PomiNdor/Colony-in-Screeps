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
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            var towers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return
                            structure.structureType == STRUCTURE_TOWER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            var storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return
                            structure.structureType == STRUCTURE_STORAGE &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
                else creep.moveTo(37,17, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleHarvester;




// var roleHarvester = {

//     /** @param {Creep} creep **/
//     run: function(creep) {
// 	    if(creep.store.getFreeCapacity() > 0) {
//             var sources = creep.room.find(FIND_SOURCES);
//             if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
//                 creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
//             }
//         }
//         else {
//             var targets = creep.room.find(FIND_STRUCTURES, {
//                     filter: (structure) => {
//                         return (structure.structureType == STRUCTURE_TOWER || 
//                                 structure.structureType == STRUCTURE_EXTENSION || 
//                                 structure.structureType == STRUCTURE_SPAWN) &&
//                             structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
//                     }
//             });
//             if(targets.length > 0) {
//                 if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//                     creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
//                 }
//             }
//         }
// 	}
// };

// module.exports = roleHarvester;