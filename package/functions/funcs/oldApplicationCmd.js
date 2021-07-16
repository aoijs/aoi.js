module.exports = async d =>{
    let code = d.command.code 

    let inside = d.unpack()

    let err = d.inside(inside)
    if(err) return d.error(err)

    let opt = inside.inside 

    if(!["id","name","version","description","options","guildID","timestamp","createdAt","applicationID","defaultPermission"].includes(opt)) return d.error(`\`${d.func}: Invalid Option Provided In ${inside}`)

    return {

        code: code.replaceLast(

            `$oldApplicationCmd${inside}`,opt == "options" ? JSON.stringify(d.data.oldData[opt],null,2) : opt == "applicationID" ? d.data.oldData.application.user.id : opt == "guildID" ? d.data.oldData.guild == null ? null : d.data.oldData.guild.id : d.data.oldData[opt] || "")

        

            }

    

}