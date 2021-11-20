const InviteSystem = require('../classes/InviteSystem.js') 
module.exports = async client => {
 client.inviteSystem = new InviteSystem(client,client.options.fetchInvites?.cacheInviters||false)
 client.inviteSystem.fetchAll()
    if(client.options.fetchInvites?.cacheInviters){
 client.inviteSystem.fetchInviters()
        }
    
}