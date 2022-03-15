/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */
var moduleFunctions = require('module.functions');

module.exports = {
    run: function(tower) {
        let fraction = moduleFunctions.FindFractionMemory(tower.room.name);
        let healCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => {return creep.hits < creep.hitsMax}});
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        } else if (healCreep) {
            tower.heal(healCreep);
        } else if (tower.store[RESOURCE_ENERGY] > fraction.towers.minEnergy) {
            var targets_repair = tower.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL && object.hits < fraction.towers.maxRepairHits});
            targets_repair.sort((a,b) => a.hits - b.hits);
            if (targets_repair.length)
                tower.repair(targets_repair[0]);
        } else if (tower.store[RESOURCE_ENERGY] > fraction.towers.minEnergy / 4 * 3) {
            var targets_repair = tower.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.hits < fraction.towers.maxRepairHits});
            targets_repair.sort((a,b) => a.hits - b.hits);
            if (targets_repair.length)
                tower.repair(targets_repair[0]);
        }
    }
};






/*
var towerRangeImpactFactor = function(distance) {
    if(distance <= TOWER_OPTIMAL_RANGE) {
        return 1
    }
    if(distance >= TOWER_FALLOFF_RANGE) {
        return 1 - TOWER_FALLOFF
    }
    var towerFalloffPerTile = TOWER_FALLOFF / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE)
    return 1 - (distance - TOWER_OPTIMAL_RANGE) * towerFalloffPerTile
}

var damage = TOWER_POWER_ATTACK * towerRangeImpactFactor(distance)
*/