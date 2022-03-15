/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.creep');
 * mod.thing == 'a thing'; // true
 */
var moduleFunctions = require('module.functions');

module.exports = {
    // pos - RoomPosition - constructor(x, y, roomName)
    // 
    // moveTo: function(pos, opts = {}) { }
    
    puttingResources: function(creep, moveOpts = { visualizePathStyle: {stroke: '#ffffff'} }) {
        
        let spawnOrExtension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION || 
                    structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
           filter: (structure) => {
               return structure.structureType == STRUCTURE_TOWER && structure.store[RESOURCE_ENERGY] < 800;
           }
        });
        
        if(spawnOrExtension) {
            if(creep.transfer(spawnOrExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawnOrExtension, moveOpts);
            }
        } else if (tower) {
            if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tower, moveOpts);
            }
        } else if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.storage, moveOpts);
        } else if (creep.room.terminal && creep.room.terminal.store.getFreeCapacity() > 0) {
            if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.terminal, moveOpts);
        }
    }
    
};