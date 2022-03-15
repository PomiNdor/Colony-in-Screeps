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
    
    // Положить ресурсы
    /*putResourcesInBase: function(creep, moveOpts = { visualizePathStyle: {stroke: '#ffffff'} }) {
        
        if (creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
            if (creep.room.terminal && creep.room.terminal.store.getFreeCapacity() > 0) {
                for(let res in creep.store) {
                    if (res != RESOURCE_ENERGY) {
                        if(creep.transfer(creep.room.terminal, res) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.terminal, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                    }
                }
            } else if (creep.room.storage && creep.room.storage.store.getFreeCapacity() > 0) {
                for(let res in creep.store) {
                    if (res != RESOURCE_ENERGY) {
                        if(creep.transfer(creep.room.storage, res) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.storage, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                    }
                }
            }
        } else {
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
                    creep.moveTo(spawnOrExtension, {ignoreCreeps: true, ...moveOpts});
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
    },*/



    setPrototypes: function() {
        if (!Creep.prototype.GetTarget) {
            Creep.prototype.GetTarget = function() {
                return Game.getObjectById(this.memory.target.id);
            }
        }
        if (!Creep.prototype.GetMemoryTarget) {
            Creep.prototype.GetTarget = function() {
                return this.memory.target;
            }
        }
        if (!Creep.prototype.ShowUsedCPU) {
            Creep.prototype.ShowUsedCPU = function() {
                console.log(this.name, 'USED CPU');
            }
        }

        // Функция выкладки ресурсов на базу
        if (!Creep.prototype.PutResInBase || Creep.prototype.PutResInBase) {
            Creep.prototype.PutResInBase = function() {

                if (this.memory.targetPut) {
                    let target = Game.getObjectById(this.memory.targetPut.id);
                    if (!target || target.store.getFreeCapacity() == 0)
                        delete this.memory.targetPut;
                }
                if (!this.memory.targetPut) {
                    let storage_link = moduleFunctions.FindLink('storage', this.room.name);


                    // this.memory.targetPut = { id: '', type: '' };

                    let target_spawn = this.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                structure.structureType == STRUCTURE_EXTENSION || 
                                structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });

                    let towers = this.room.find(FIND_STRUCTURES, { filter: (structure) => {
                                return  structure.structureType == STRUCTURE_TOWER &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });

                    towers.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);



                    let putTerminal = function(gameRoom) {
                        let storage = gameRoom.storage;
                        let terminal = gameRoom.terminal;
                        return terminal && terminal.store.getFreeCapacity() > 0 
                            && (terminal.store[RESOURCE_ENERGY] < 100000 
                                || terminal.store[RESOURCE_ENERGY] < 200000 && storage && storage.store[RESOURCE_ENERGY] > 500000);
                    }



                    if (this.store.getUsedCapacity() > this.store[RESOURCE_ENERGY]) {
                        if (this.room.terminal && this.room.terminal.store.getFreeCapacity() > 0) {
                            this.memory.targetPut = { id: this.room.terminal.id, pos: this.room.terminal.pos, type: 'terminal' };
                        } else if (this.room.storage && this.room.storage.store.getFreeCapacity() > 0) {
                            this.memory.targetPut = { id: this.room.storage.id, pos: this.room.storage.pos, type: 'storage' };
                        }
                    }


                    else if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < 100) {
                        this.memory.targetPut = { id: towers[0].id, pos: towers[0].pos, type: 'tower' };
                    }
                    else if(target_spawn) {
                        this.memory.targetPut = { id: target_spawn.id, pos: target_spawn.pos, type: 'spawn' };
                    } 
                    // -----------
                    else if (storage_link && storage_link.store[RESOURCE_ENERGY] != 800 && this.room.storage && this.room.storage.store[RESOURCE_ENERGY] > 20000) {
                        this.memory.targetPut = { id: storage_link.id, pos: storage_link.pos, type: 'link' };
                    } 
                    else if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < 700) {
                        this.memory.targetPut = { id: towers[0].id, pos: towers[0].pos, type: 'tower' };
                    }
                    
                    else if (putTerminal(this.room)) {
                        this.memory.targetPut = { id: this.room.terminal.id, pos: this.room.terminal.pos, type: 'terminal' };
                    } else if (this.room.storage) {
                        this.memory.targetPut = { id: this.room.storage.id, pos: this.room.storage.pos, type: 'storage' };
                    } else {
                        this.say('else');
                        let fraction = moduleFunctions.FindFractionMemory(this.room.name);
                        if (fraction && fraction.restPoint)
                            this.moveTo(fraction.restPoint.x, fraction.restPoint.y, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } 
                if (this.memory.targetPut) {

                    if (!this.InObjectRadius(this.memory.targetPut)) {
                        this.say(this.memory.targetPut.type);
                        this.moveTo(this.memory.targetPut.pos.x, this.memory.targetPut.pos.y);
                    } else {
                        let target = Game.getObjectById(this.memory.targetPut.id);
                        
                        if (this.memory.targetPut.type == 'terminal' || this.memory.targetPut.type == 'storage') {
                            for(let res in this.store) {
                                if(this.transfer(target, res) == ERR_NOT_IN_RANGE) {
                                    this.moveTo(target, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                                    break;
                                }
                            }
                        } else {
                            if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                this.moveTo(target, {maxRooms: 1, visualizePathStyle: {stroke: '#ffffff'}});
                            }
                        }

                        // if (this.store.getUsedCapacity() == 0)
                        delete this.memory.targetPut;
                    }
                }


            }
        }

        if (!Creep.prototype.CheсkStatus) {
            Creep.prototype.CheсkStatus = function(type) {

                if (this.memory[type] === undefined) this.memory[type] = false;
                
                // Если не upgraiding и нет свободного места - то upgraiding
                if (!this.memory[type] && this.store.getFreeCapacity() == 0) {
                    this.memory[type] = true;
                    this.say('🚧 ' + type);
                }
                if (this.memory[type] && this.store.getUsedCapacity() == 0) {
                    this.memory[type] = false;
                    this.say('🔄 harvest');
                }
            };
        }
        if (!Creep.prototype.InObjectRadius) {
            Creep.prototype.InObjectRadius = function(object, radius = 1) {
                let x = this.pos.x - object.pos.x;
                let y = this.pos.y - object.pos.y;
                return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
            };
        }

    }
    
};


