/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.reserver');
 * mod.thing == 'a thing'; // true
 */
var moduleFunctions = require('module.functions');
var moduleCreep = require('module.creep');

module.exports = {
    run: function(creep) {
        if (creep.spawning) return;
        creep.CheсkStatus('building');

        if(creep.memory.building) {
            let targetRoom = 'W43N1';
            if (creep.room.name != targetRoom) {
                let route = Game.map.findRoute(creep.room, targetRoom);
                if(route && route.length > 0) {
                    let exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                let target;// = Game.getObjectById('617edaedb052952f00ae0843');
                var targets_build = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if(targets_build.length) {
                    if(creep.build(targets_build[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets_build[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        } else {
            if (creep.room.name != creep.memory.fractionRoom) {
                let route = Game.map.findRoute(creep.room, creep.memory.fractionRoom);
                if(route && route.length > 0) {
                    let exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                let target_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: target => target.resourceType == RESOURCE_ENERGY && target.amount > 100}); // не тестил
                let target_tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил
                let target_ruins = creep.pos.findClosestByRange(FIND_RUINS, {filter: target => target.store.getUsedCapacity(RESOURCE_ENERGY) > 0}); // не тестил
    
    
                if (target_resource) {
                    if (creep.pickup(target_resource) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target_resource, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                        
                } else if (target_tombstone) {
                    if(creep.withdraw(target_tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target_tombstone, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                } else if (target_ruins) {
                    if(creep.withdraw(target_ruins, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target_ruins, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                } else if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= 10000) {
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                        
                } else {    // То что было раньше
                    var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE); //creep.room.find(FIND_SOURCES_ACTIVE);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: builderColor}});
                    }
                }
            }
        }


        // 
        // let targetRoom = 'W43N1';
        // if (creep.room.name != targetRoom) {
        //     let route = Game.map.findRoute(creep.room, targetRoom);
        //     if(route && route.length > 0) {
        //         let exit = creep.pos.findClosestByRange(route[0].exit);
        //         creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
        //     }
        // } else {
        //     if (creep.store[RESOURCE_ENERGY] > 30) {
        //         var targets_build = creep.room.find(FIND_CONSTRUCTION_SITES);
        //         if(targets_build.length > 0) {
        //             console.log(creep.build(targets_build[0]));
                    
        //             if(creep.build(targets_build) == ERR_NOT_IN_RANGE) {
        //                 creep.moveTo(targets_build[0], {visualizePathStyle: {stroke: builderColor}});
        //             }
        //         }
                
        //     } else {
        //         let target = Game.getObjectById('6015fa82ea57a85a28d58a6a');
        //         if (target) {
        //             if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
        //                 creep.moveTo(target, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
        //         }
        //     }
        // }
    }
};



          