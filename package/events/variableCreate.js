module.exports = async  (client,db, variable,key,value, timestamp)=> {
    require('../handlers/variableCreateCommands')(client,db,variable,key,value, timestamp)
    }