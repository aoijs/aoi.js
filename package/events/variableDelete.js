module.exports = async  (client,db, variable,key,value,type, timestamp)=> {
    require('../handlers/variableDeleteCommands')(client,db,variable,key,value,type,timestamp)
    }