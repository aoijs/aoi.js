const Group = require('../CacheHandler/group.js')
class InteractionManager {
constructor(client){
    this.client = client 
    this.cache = {
        slashCommandData:new Group(),
        buttonData:new Group(),
        selectMenuData:new Group()
    }
    client.interactionManager = this
}
 async AddSlashCommandData    
}