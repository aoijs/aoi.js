module.exports = async  (client,err,db, command,message)=> {
    require('../handlers/errorCommands')(client,err,db,command,message)
    }

/* 
sends client , error message , db , command that was executed and message????

idk why i did this but not going to change cause ik this is needed 
*/