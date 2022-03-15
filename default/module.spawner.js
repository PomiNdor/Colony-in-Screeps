const CREEP_PARTS = {
    // default
    0: {
        searcher:       [MOVE],
        transporter:    [...(new Array(20).fill(CARRY)), ...(new Array(20).fill(MOVE))],
        
        miner:          [...(new Array(7).fill(WORK)), CARRY, ...(new Array(8).fill(MOVE))],
        carrier:        [...(new Array(20).fill(CARRY)), ...(new Array(20).fill(MOVE))],
        reserver:       [...(new Array(5).fill(CLAIM)), ...(new Array(10).fill(MOVE))],

        harvester:      [...(new Array(4).fill(WORK)), ...(new Array(4).fill(CARRY)), ...(new Array(8).fill(MOVE))],
        upgrader:       [...(new Array(8).fill(WORK)), ...(new Array(6).fill(CARRY)), ...(new Array(14).fill(MOVE))],
        builder:        [...(new Array(8).fill(WORK)), ...(new Array(6).fill(CARRY)), ...(new Array(14).fill(MOVE))],
        carriUpgrader:  [...(new Array(20).fill(WORK)), ...(new Array(1).fill(CARRY)), ...(new Array(4).fill(MOVE))],
        dismantle:      [...(new Array(8).fill(WORK)), ...(new Array(6).fill(CARRY)), ...(new Array(14).fill(MOVE))]
    },
    // 1 lvl -> 300
    250: {
        harvester:  [WORK, CARRY, MOVE, MOVE],
        upgrader:   [WORK, CARRY, MOVE, MOVE],
        builder:    [WORK, CARRY, MOVE, MOVE]
    },
    // 2 lvl -> 300 + 50 * 5
    550: {
        harvester:  [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        upgrader:   [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        builder:    [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    },
    // 3 lvl -> 300 + 50 * 10
    800: {
        harvester:   [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        miner:       [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
        transporter: [...(new Array(8).fill(CARRY)), ...(new Array(8).fill(MOVE))],
        carrier:     [...(new Array(8).fill(CARRY)), ...(new Array(8).fill(MOVE))],
        upgrader:    [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        builder:     [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    // 4 lvl -> 300 + 50 * 20
    1300: {
        carrier:     [...(new Array(10).fill(CARRY)), ...(new Array(10).fill(MOVE))],
        upgrader:    [...(new Array(5).fill(WORK)), ...(new Array(5).fill(CARRY)), ...(new Array(10).fill(MOVE))],
        builder:     [...(new Array(5).fill(WORK)), ...(new Array(5).fill(CARRY)), ...(new Array(10).fill(MOVE))],
        transporter: [...(new Array(10).fill(CARRY)), ...(new Array(10).fill(MOVE))],
        reserver:    [CLAIM, CLAIM, MOVE, MOVE],
    },
    // 5 lvl -> 300 + 50 * 30
    1800: {
        upgrader:       [...(new Array(8).fill(WORK)), ...(new Array(6).fill(CARRY)), ...(new Array(14).fill(MOVE))],
        carrier:        [...(new Array(15).fill(CARRY)), ...(new Array(15).fill(MOVE))],
        carriUpgrader:  [...(new Array(15).fill(WORK)), ...(new Array(1).fill(CARRY)), ...(new Array(4).fill(MOVE))],
        transporter:    [...(new Array(15).fill(CARRY)), ...(new Array(15).fill(MOVE))],
        reserver:       [CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE]
    },
    // 6 lvl -> 300 + 50 * 40 = 2300
    2300: {
        upgrader:       [...(new Array(10).fill(WORK)), ...(new Array(8).fill(CARRY)), ...(new Array(18).fill(MOVE))],
        carriUpgrader:  [...(new Array(20).fill(WORK)), ...(new Array(1).fill(CARRY)), ...(new Array(4).fill(MOVE))],
        transporter:    [...(new Array(15).fill(CARRY)), ...(new Array(15).fill(MOVE))],
        reserver:       [CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    // 7 lvl -> 300 + 100 * 50 = 5300
    5300: {
        upgrader:       [...(new Array(15).fill(WORK)), ...(new Array(10).fill(CARRY)), ...(new Array(25).fill(MOVE))],
        carriUpgrader:  [...(new Array(30).fill(WORK)), ...(new Array(1).fill(CARRY)), ...(new Array(4).fill(MOVE))],
        transporter:    [...(new Array(15).fill(CARRY)), ...(new Array(15).fill(MOVE))]
    },
    // 8 lvl -> 300 + 200 * 60
    12300: {},
}





class CreepSettings {
    // #role = '';
    // #body = [];
    // #countMax = 0;
    constructor(role, body, countMax) {
        this._role = role;
        this._body = body;
        this._countMax = countMax;
        this.count = 0;
        this.isCreate = true; // Нужно ли создавать
    }
    get role() { return this._role; }
    get body() { return this._body; }
    get countMax() { return this._countMax; }

    toString(opts = { showBody: false, minimize: false }) {
        if (opts.minimize)  // 0/1* searcher
            return `${this.count}/${this.countMax}${!this.isCreate ? '*' : ''} ${this.role}`;

        let str = `Роль: ${this.role}, количество ${this.count} из ${this.countMax}`;
        if (!this.isCreate) str += ' (не создавать)';
        if (opts.showBody) str += `\nТело: ${this.body}`;
        return str;
    }
    isMaxCount() {
        return this.count >= this.countMax;
    }
}

function SpawnCreep(body, role, opts = {}) {
    if (this.spawning) return ERR_BUSY;

    if (!Memory.creepNameCounter || typeof Memory.creepNameCounter !== 'object')
        Memory.creepNameCounter = {};
    if (!Memory.creepNameCounter[role] || typeof Memory.creepNameCounter[role] !== 'number') 
        Memory.creepNameCounter[role] = 0;
    let name, dryRun;
    
    do {
        name = `${role}_${Memory.creepNameCounter[role]++}`;
        dryRun = this._spawnCreep(body, name, { ...opts, dryRun: true });
    } while (dryRun === ERR_NAME_EXISTS);
    
    let err = this._spawnCreep(body, name, 
                               {...opts, memory: { role: role, fractionRoom: this.room.name}}
        );
    if (err != 0) Memory.creepNameCounter[role]--;
    return err;
};


module.exports = {
    deleteOldCreeps: function() {
        // Удаление старых крипов из памяти
        for (var name in Memory.creeps)
            if (!Game.creeps[name]) DeleteCreepInMemory(name);
        // ----------------
    },
    run: function(spawn) {
        // Переопределение метода спавна крипов
        if (!StructureSpawn.prototype._spawnCreep) {
            StructureSpawn.prototype._spawnCreep = StructureSpawn.prototype.spawnCreep;
            StructureSpawn.prototype.spawnCreep = SpawnCreep;
        }
        // ----------------

        // Поиск главной комнаты спавна в памяти
        let fraction;
        for(let i in Memory.fractions) {
            if (Memory.fractions[i].roomName == spawn.room.name) {
                fraction = Memory.fractions[i];
                break;
            }
        }
        if (!fraction) {
            console.log("Ошибки считывания памяти комнаты ", spawn.room.name);
            return;
        }
        // ----------------
        

        // Подсчет крипов
        for (var role in fraction.creeps)
            fraction.creeps[role].count = 0;

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            // Если крип не принадлежит комнате с этим спавном - пропускаем
            if (creep.memory.fractionRoom != spawn.room.name) continue;
            
            
            if (fraction.creeps[creep.memory.role]) {
                if (creep.memory.role != 'transporter' || creep.ticksToLive > 100)
                    fraction.creeps[creep.memory.role].count++;
            }
        }
        // ----------------


        //  Ищем максимальное доступное кол-во энергии
        var energyCreepParts = 0;
        for (var energy in CREEP_PARTS) {
            if (energy <= spawn.room.energyCapacityAvailable)
                energyCreepParts = energy;
            else break;
        }
        // ----------------
        // console.log(energyCreepParts);
        
        // Если спавн свободен - создаем крипов
        if (spawn.spawning == null) {
            // console.log(spawn.room.energyAvailable);
            if (fraction.creeps['harvester'].count == 0 
                && fraction.creeps['harvester'].countMax > 0
                && spawn.room.energyAvailable < energyCreepParts) {
                spawn.spawnCreep(CREEP_PARTS[250]['harvester'], 'harvester');
            }
            for (var role in fraction.creeps) {
                if (fraction.creeps[role].count < fraction.creeps[role].countMax) {
                    
                    // Строители не нужны если нечего строить
                    if (role == 'builder' && spawn.room.find(FIND_CONSTRUCTION_SITES).length == 0)
                        continue;

                    if (role == 'transporter' && fraction.creeps['miner'].count == 0 && Game.rooms[fraction.roomName].memory.countResEnergy < 300) {
                        continue;
                    }

                    if (CREEP_PARTS[energyCreepParts][role])
                        spawn.spawnCreep(CREEP_PARTS[energyCreepParts][role], role);
                    else spawn.spawnCreep(CREEP_PARTS[0][role], role);
                    break;
                }
            }
        }
        // ----------------
    }
};

function DeleteCreepInMemory(creepName) {
    console.log("Удаление несуществующего крипа из памяти! " + creepName);
    if (Memory.creeps[creepName].role == 'miner') 
        for (var roomName in Memory.rooms) {
            let room = Memory.rooms[roomName];
            let resources = _.filter(room.resources, item => (_.find(item.creeps, creep => creep.name == creepName)));
            Memory.test = resources;
            if (resources)
                resources.forEach(res => res.creeps.splice(_.findIndex(res.creeps, resCreep => resCreep.name == creepName), 1));
        }
    delete Memory.creeps[creepName];
}
