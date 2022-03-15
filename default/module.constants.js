/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.constants');
 * mod.thing == 'a thing'; // true
 */
 
// const builders_countMax = 2;
// const harvesters_countMax = 2;
// const upgraders_countMax = 3;
// const miners_countMax = 5;
// const carriers_countMax = 5;
// const carriUpgraders_countMax = 3;

// const harvesterParts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, CARRY, MOVE,  MOVE];
// const builderParts   = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, MOVE,  MOVE,  MOVE];
// const upgraderParts  = [WORK, WORK, WORK, WORK,  CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; //[WORK, WORK, WORK,  CARRY, CARRY, CARRY, MOVE,  MOVE];
// const carrierParts   = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
//                         MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE];
// const minerParts     = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
// const carriUpgraderParts = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, 
//                             MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,  MOVE,  MOVE,  MOVE];

const roomNames = ['E1S17', 'E2S18', 'E1S16', 'E1S18']; // 'E1S18'


module.exports = {
    
    roomRootName: 'E2S17',
    roomNames: roomNames  // 'E2S17' 'E1S16'
};