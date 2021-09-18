const moment = require("moment");

module.exports = async d => {
    let code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
    let [channelID, messageID, option] = inside.splits
    
    let channel = d.client.channels.cache.get(channelID)
    
    if (!channel) return d.error(`\`${d.func}: Invalid channel ID in 1st field of ${inside}\``)
    


    // if(!message) 

 let result = option.toLowerCase()

 if (!result && (option != "isdeleted")) result = undefined

 if(!result)  return d.error(`\`${d.func}: Missing option in 3rd field of ${inside}\``)
 if(![
    "author",
    "authormention",
    "authortag",
    "authorname",
    "channelid",
    "channelname",
    "channelmention",
    "nomentioncontent",
    "content",
    "iscrosspostable",
    "created",
    "editedat",
    "editedtimestamp",
    "guildid",
    "id",
    "istts",
    "type",
    "issystem",
    "isdeletable",
    "isdeleted",
    "iseditable",
    "ispinnable",
    "ispinned",
    "cleancontent",
    "guildname",
    "webhookid",
    "url"
].includes(result.toLowerCase())) return d.error(`\`${d.func}: Invalid option in 3rd field of ${inside}\``)

try {
    let message = await d.channel.messages.fetch(messageID) 

    switch(result) {
        case "author": result = message.author;
            break;
        case "authormention": result = message.author.toString(messageID);
            break;
        case "authorname": result = message.author.username;
            break;
        case "authortag" : result = message.author.tag;
            break;
        case "channelid": result = message.channel;
            break;
        case "channelname": result = message.channel.name;
            break;
        case "channelmention": result = message.channel.toString(channel);
            break;
        case "nomentioncontent": result = message.cleanContent;
            break;
        case "content": result = message.content;
            break;
        case "iscrosspostable": result = message.crosspostable;
            break;
        case "created": result = moment(message.createdAt).format("LLLL");
            break;
        case "editedat": result = moment(message.editedAt).format("LLLL");
            break;
        case "editedtimestamp": result = message.editedTimestamp;
            break;
        case "guildid": result = message.guild;
            break;
        case "id": result = message.id;
            break;
        case "istts": result = message.tts;
            break;
        case "type": result = message.type;
            break;
        case "issystem": result = message.system;
            break;
        case "isdeletable": result = message.deletable;
            break;
        case "isdeleted": result = message.deleted;
            break;
        case "iseditable": result = message.editable;
            break;
        case "ispinnable": result = message.pinnable;
            break;
        case "ispinned": result = message.pinned;
            break;
        case "cleancontent": result = message.cleanContent.split('@').join('');
            break;
        case "guildname": result = message.guild.name;
            break;
        case "webhookid": result = message.webhookID;
            break;
        case "url": result = message.url;
            break;
            default: undefined
            break;
        }
    
} catch {
return d.error(`\`${d.func}: Invalid message ID in 2nd field of ${inside}\``)
}
    return {
        code: code.replaceLast(`$msg${inside}`, result)
    }
}
