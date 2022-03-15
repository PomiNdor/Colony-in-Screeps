function FindLinks(roomName) {
    let gameRoom = Game.rooms[roomName];
    if (!gameRoom) {
        console.log("WARNING FindLinks не найдена комната фракции" + roomName);
        return;
    }
    let LinkInObjectRadius = (linkPos, objectPos, radius = 1) => {
        let x = linkPos.x - objectPos.x;
        let y = linkPos.y - objectPos.y;
        return (x >= -radius && x <= radius) && (y >= -radius && y <= radius);
    }

    // console.log(gameRoom.memory.links[0]);
    // Если ранее их небыло вообще
    if (!gameRoom.memory.links || Object.keys(gameRoom.memory.links).length === 0)
        gameRoom.memory.links = {};

    let links = gameRoom.find(FIND_STRUCTURES, 
        { filter: (structure) => structure.structureType == STRUCTURE_LINK });
    if (links.length > 0) {
        for (let i in links) {
            let link = links[i];
            // console.log(link);
            if (LinkInObjectRadius(link.pos, gameRoom.controller.pos, 2)) {
                gameRoom.memory.links['controller'] = { id: link.id };
                // console.log("LINKS Add controller link in room " + roomName);
            } else if (LinkInObjectRadius(link.pos, gameRoom.storage.pos)) {
                gameRoom.memory.links['storage'] = { id: link.id };
                // console.log("LINKS Add storage link in room " + roomName);
            } else {
                if (!gameRoom.memory.links['resource'])
                    gameRoom.memory.links['resource'] = {};
                for (let j in gameRoom.memory.resources) {
                    // console.log(gameRoom.memory.resources[j]);
                    if (LinkInObjectRadius(link.pos, gameRoom.memory.resources[j].pos, 2)) {
                        // console.log(gameRoom.memory.resources[j].id);
                        gameRoom.memory.links['resource'][gameRoom.memory.resources[j].id] = { id: link.id };
                        // console.log("LINKS Add resource link in room " + roomName);
                    }
                }
            }
        }
    } // else { }
}



module.exports = {
    run: function(roomName) {
        if (Memory.rooms && Memory.rooms[roomName]) {

            FindLinks(roomName);
            let memoryRoom = Memory.rooms[roomName];
            if (memoryRoom.links && memoryRoom.links.controller) {

                let controller_link = Game.getObjectById(memoryRoom.links.controller.id);
                if (controller_link && controller_link.store[RESOURCE_ENERGY] < 5) {
                    
                    let status = false;
                    // Сначала пробуем передать ресурсы из линков рядом с источниками
                    for (let key in memoryRoom.links.resource) {
                        let resource_link = Game.getObjectById(memoryRoom.links.resource[key].id);
                        if (resource_link.store[RESOURCE_ENERGY] > 750) {
                            status = resource_link.transferEnergy(controller_link) == OK;
                            if (status) break;
                        }
                    }


                    // Потом из линка рядом со складом
                    if (!status && memoryRoom.links.storage) {
                        let storage_link = Game.getObjectById(memoryRoom.links.storage.id);
                        if (storage_link && storage_link.store[RESOURCE_ENERGY])
                            storage_link.transferEnergy(controller_link);
                    }
                }
            }
        }
    }
};


