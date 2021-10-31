module.exports = async d => {
const { code } = d.command;
const inside = d.unpack();
const [guildId = d.guild.id,user] = inside.splits;
    const guild = await d.util.getGuild(d,guildId) 
    let result = await guild.bans.fetch({user}).catch(err => { 
        result = 0;
        d.aoiError.fnError(d,"custom",{},"Failed To Fetch Bans");
    }) 
    return {
        code : d.util.setCode({code,inside,function : d.func,result})
    } 
}