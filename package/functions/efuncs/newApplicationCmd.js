module.exports = async d =>{

    let code = d.command.code 

let inside = d.unpack() 

let err = d.inside(inside) 

if(err) return d.error(err) 

    

    let opt = inside.inside 

    if(!["id","name","version","description","options","guildID","timestamp","createdAt","applicationID","defaultPermission"].includes(opt)) return d.error(`:x: Invalid Option Provided In $newApplicationCmd${inside}`) 

    return {

        code: code.replaceLast(

            `$newApplicationCmd${inside}`,opt == "options" ? JSON.stringify(d.data.newData[opt],null,2) : opt == "applicationID" ? d.data.newData.application.user.id : opt == "guildID" ? d.data.newData.guild == null ? null : d.data.newData.guild.id : d.data.newData[opt] || "")

        

            }

    

}