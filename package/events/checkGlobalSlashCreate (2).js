module.exports = async  (type,name, client)=> {

    require('../handlers/checkGlobalSlashCreate')(type,name,client)

    }

