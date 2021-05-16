module.exports = async  (client,commandID,guildID,oldData)=> {

    require('../handlers/checkSlashUpdate')(client,commandID,guildID,oldData)

    }

