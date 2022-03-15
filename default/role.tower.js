/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        if (tower.energy > 800) {
            var targets_repair = tower.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL});
            targets_repair.sort((a,b) => a.hits - b.hits);
            if (targets_repair.length)
                tower.repair(targets_repair[0]);
        }
    }
};