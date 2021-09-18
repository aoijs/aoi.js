const moment = require("moment");
const ms = require('parse-ms');

module.exports = async d => {
    let code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
    let [id, result] = inside.splits
    
    let server = (d.client.guilds.cache.get(id ? id : d.message.guild.id))

    if (!server && (result.toLowerCase() != "isbotremoved")) result = undefined

 if(![
    "name",
    "id",
    "afkchannelid",
    "afktimeout",
    "isavailable",
    "isbotremoved",
    "isverified",
    "ispartnered",
    "description",
    "created",
    "region",
    "membercount",
    "ownerid",
    "nsfwlevel",
    "joinedtimestamp",
    "joinedat",
    "afktimeout",
    "boostcount",
    "boostlevel",
    "updateschannel",
    "ruleschannel",
    "systemchannelid",
    "verificationlvl",
    "timestamp",
    "acronym",
    "emojicount"
].includes(result.toLowerCase())) return d.error(`\`${d.func}: Invalid option in 2nd field of ${inside}\``)

switch(result) {
    case "name": result = server.name;
        break;
    case "isavailable": result = server.available;
        break;
    case "isbotremoved": 
        try {
            result = server.deleted;
            if(result === null) result = undefined
        } catch {
            result = undefined
        }
        break;
    case "isverified" : result = server.verified;
        break;
    case "ispartnered": result = server.partnered;
        break;
    case "id": result = server.id;
        break;
    case "afkchannelid": 
        try {
            result = server.afkChannelID;
            if(result === null) result = undefined
        } catch {
            result = undefined
        }
        break;
    case "afktimeout": 
        try {
            result = server.afkTimeout;
            if(result === null) result = undefined
        } catch {
            result = undefined
        }
        break;
    case "created": result = moment(server.createdAt).format("LLLL");
        break;
    case "timestamp":
        result = Object.entries(ms(Date.now() - server.createdTimestamp)).map((x,y)=> {
            if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`
        }).filter(x => x).join(", ")
        if(!result) result = undefined
        break;
    case "description": 
        try {
            result = server.description;
            if(result === null) result = undefined
        } catch {
            result = undefined
        }
        break;
    case "region": result = server.region;
        break;
    case "ownerid": result = server.ownerID;
        break;
    case "nsfwlevel": result = server.nsfwLevel;
        break;
    case "joinedtimestamp": result = server.joinedTimestamp;
        break;
    case "joinedat":
        result = Object.entries(ms(Date.now() - server.joinedTimestamp)).map((x,y)=> {
            if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`
        }).filter(x => x).join(", ")
        if(!result) result = undefined
        break;
    case "afktimeout": result = server.afkTimeout;
        break;
    case "membercount": result = server.memberCount;
        break;
    case "boostcount": result = server.premiumSubscriptionCount;
        break;
    case "boostlevel": result = server.premiumTier;
        break;
    case "updateschannel": 
        try {
            result = server.publicUpdatesChannel;
            if(result === null) result = undefined
        } catch {
            result = undefined
        }
        break;
    case "ruleschannel": 
        try {
            result = server.rulesChannelID;
            if(result === null) result = undefined
        } catch {
            result = undefined
        }
        break;
    case "systemchannelid": 
        try {
            result = server.systemChannelID;
            if(result === null) result = undefined
        } catch {
            result = undefined
        }
        break;
    case "verificationlvl": result = server.verificationLevel;
        break;
    case "acronym": result = server.nameAcronym;
        break;
    case "emojicount": result = server.emojis.cache.size;
        break;

    default: undefined
    };
 
    return {
        code: code.replaceLast(`$guild${inside}`, result)
    }
}
