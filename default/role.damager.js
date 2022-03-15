/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.damager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        
        //console.log(creep.getObjectById('5bbcad559099fc012e63722e'));
        const route = Game.map.findRoute(creep.room, 'E4S16');
        if(route.length > 0) {
            //console.log('Now heading to room '+route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit, {visualizePathStyle: {stroke: 'red', opacity: 0.5}});
        }
        else {
            // let target_tower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, 
            //     { filter: (structure) => { 
            //         return  structure.structureType == STRUCTURE_TOWER; }
            // });
            let target_creep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);//FIND_HOSTILE_CREEPS
            console.log(target_creep);
            // if (target_tower) {
            //     if(creep.attack(target_tower) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target_tower, {visualizePathStyle: {stroke: 'red'}});
            //     }
            // }
            // else 
            if(target_creep) {
                
                console.log(creep);
                console.log(creep.attack(target_creep));
                if(creep.attack(target_creep) == ERR_NOT_IN_RANGE) {
                    console.log('errattack');
                    creep.moveTo(target_creep, {visualizePathStyle: {stroke: 'red'}});
                }
            } else {
                target_spawns = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);//FIND_HOSTILE_CREEPS
                if(creep.attack(target_spawns) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target_spawns, {visualizePathStyle: {stroke: 'red'}});
                }
                target_sturctures = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => { return structure.structureType != 'controller'}
                });//FIND_HOSTILE_CREEPS
                console.log(target_sturctures);
                if(creep.attack(target_sturctures) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target_sturctures, {visualizePathStyle: {stroke: 'red'}});
                }
            }
        }
    }
};