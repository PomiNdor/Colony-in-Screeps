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
        
        let route;
        if (creep.memory.rootRoomName == 'E2S17') {
            if (creep.room.name != 'E2S16')
                route = Game.map.findRoute(creep.room, 'E2S16');
        }
        else if (creep.memory.rootRoomName == 'E4S17') {
            if (creep.room.name != 'E5S18')
                route = Game.map.findRoute(creep.room, 'E5S18');
            // creep.moveTo(new RoomPosition(28,13, 'E4S19'), {visualizePathStyle: {stroke: 'red', opacity: 0.5}});
        }
            

        if(route && route.length > 0) {
            const exit = creep.pos.findClosestByRange(route[0].exit);
            
            // Атака по пути
            let target_creep;// = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);//FIND_HOSTILE_CREEPS
            if(target_creep) {
                if(creep.attack(target_creep) == ERR_NOT_IN_RANGE) {
                    // console.log('errattack');
                    creep.moveTo(target_creep, {visualizePathStyle: {stroke: 'red'}});
                }
            } else {
                creep.moveTo(exit, {visualizePathStyle: {stroke: 'red', opacity: 0.5}});
            }
            // ------------
        }
        else {
            let target__;// = Game.getObjectById('60e52451d0aabeac607b4dfc');   // 60e43f4fd315ecc01b65fd8e spawn
            // creep.moveTo(47, 36);
            let target_tower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, 
                { filter: (structure) => { 
                    return  structure.structureType == STRUCTURE_TOWER; }
            });
            let target_spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);//FIND_HOSTILE_CREEPS
            let target_creep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);//FIND_HOSTILE_CREEPS

            creep.attack(target_tower);
            creep.attack(target_spawn);
            creep.attack(target_creep);

            
            if (target__) {
                if(creep.attack(target__) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target__, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
            }
            else if (target_tower) {
                if(creep.attack(target_tower) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_tower, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
            }
            else if(target_spawn) {
                if (creep.attack(target_spawn) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_spawn, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
            }
            else if(target_creep) {
                if(creep.attack(target_creep) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target_creep, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
            } else {
                
                
                let target_sturcture = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => { return (
                        structure.structureType != 'controller' && 
                        structure.structureType != 'storage' &&
                        structure.structureType != 'terminal' &&
                        structure.structureType != 'extractor'
                        )}
                });
                let target_road = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => { return structure.structureType == 'container'}
                });
                
                
                //FIND_HOSTILE_CREEPS
                // console.log('target_sturctures', target_sturctures);
                if (target_sturcture) {
                    if(creep.attack(target_sturcture) == ERR_NOT_IN_RANGE) 
                        creep.moveTo(target_sturcture, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
                    
                } else {
                    creep.moveTo(21,48);
                }
                // else if (target_road) {
                //     if(creep.attack(target_road) == ERR_NOT_IN_RANGE) 
                //         creep.moveTo(target_road, {maxRooms: 1, visualizePathStyle: {stroke: 'red'}});
                // }
            }
        }
    }
};