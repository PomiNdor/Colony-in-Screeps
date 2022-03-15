/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.chemist');
 * mod.thing == 'a thing'; // true
 */

// var moduleConstants = require('module.constants');
var moduleFunctions = require('module.functions');
// const roomNames = moduleConstants.roomNames;


module.exports = {
    run: function(creep) {

        if (creep.memory.taking === undefined) 
            creep.memory.taking = false;
        if (creep.memory.taking && creep.store.getFreeCapacity() == 0)
            creep.memory.taking = false;

        // console.log(creep.memory.taking);

        let goRestPoint = false;
        if (creep.memory.taking) {
            if (creep.room.terminal && creep.room.terminal.store['XGH2O']) {
                if(creep.withdraw(creep.room.terminal, 'XGH2O') == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            
            } else if (creep.room.storage && creep.room.storage.store['XGH2O']) {
                if(creep.withdraw(creep.room.storage, 'XGH2O') == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
            
            } else goRestPoint = true;
        } else {
            let labsId = ['60e919abd48723af15454413'];
            for (let labId of labsId) {
                let lab = Game.getObjectById(labId);

                if (lab) {
                    if (!creep.memory.taking && creep.store.getUsedCapacity() > 0) {
                        if (creep.transfer(lab, 'XGH2O') == ERR_NOT_IN_RANGE) 
                            creep.moveTo(lab);
                    }
                    else if (lab.store['XGH2O'] < 500 && !creep.memory.taking)
                        creep.memory.taking = true;
                    else goRestPoint = true;
                } else goRestPoint = true;

            }
        }
        
        if (goRestPoint)
            creep.moveTo(11, 44);

    } 
}




function CreepInObjectRadius(creep, object, radius = 1) {
    let x = creep.pos.x - object.pos.x;
    let y = creep.pos.y - object.pos.y;
    return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
}