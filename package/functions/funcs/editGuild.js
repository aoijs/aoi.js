module.exports = async d => {
    const code = d.command.code;

    const inside = d.unpack();
    const fields = inside.splits;
    const err = d.inside(inside);

    if (err) return d.error(err);

    const options = fields[0];
    let result = fields[1];
    const guild = d.client.guilds.cache.get(fields[2]) || d.client.guilds.cache.get(d.message.guild.id);

    if (!options) return d.error(`\`${d.func}: Missing option in ${inside}\``);
    if (!result) return d.error(`\`${d.func}: Invalid result in second field in ${inside}\``);
    if (!guild) return d.error(`\`${d.func}: Invalid guild ID in ${inside}\``);

    const timeoutOpts = {
        "1m": 60, // minutes with "m" in option
        "5m": 300,
        "15m": 900,
        "30m": 1800,
        "60m": 3600,
        "1h": 3600, // 1 hour as "1h"
        "1": 60, // minutes without "s" in option
        "5": 300, // minutes without "m" or "s"
        "15": 900,
        "30": 1800,
        "60": 3600,
        "60s": 60, // seconds with "s" in option
        "300s": 300,
        "900s": 900,
        "1800s": 1800,
        "3600s": 3600,
    }

    const verifyOpts = {
        "0": "NONE",
        "1": "LOW",
        "2": "MEDIUM",
        "3": "HIGH",
        "4": "VERY_HIGH",
        "NONE": "NONE",
        "LOW": "LOW",
        "MEDIUM": "MEDIUM",
        "HIGH": "HIGH",
        "VERY_HIGH": "VERY_HIGH",
        "none": "NONE",
        "low": "LOW",
        "medium": "MEDIUM",
        "high": "HIGH",
        "very_high": "VERY_HIGH"
    }

    const explicitOpts = {
        "0": "DISABLED",
        "1": "MEMBERS_WITHOUT_ROLES",
        "2": "ALL_MEMBERS",
        "none": "DISABLED",
        "without_roles": "MEMBERS_WITHOUT_ROLES",
        "all": "ALL_MEMBERS"
    }

    const notifyOpts = {
        "0": "ALL",
        "1": "MENTIONS",
        "mentions": "MENTIONS",
        "all": "ALL",
        "MENTIONS": "MENTIONS",
        "ALL": "ALL"
    }

    const regions = {
        "russia": "russia",
        "europe": "europe",
        "india": "india",
        "japan": "japan",
        "us-west": "us-west",
        "us-south": "us-south",
        "us-east": "us-east",
        "us-central": "us-central",
        "singapore": "singapore",
        "sydney": "sydney",
        "london": "london",
        "brazil": "brazil",
        "southafrica": "southafrica"
    }

    if (![
        "name",
        "icon",
        "systemchannel",
        "ruleschannel",
        "updateschannel",
        "afkchannel",
        "afktimeout",
        "verificationlevel",
        "verificationlvl",
        "notifications",
        "contentfilter",
        "region"
    ].includes(options.toLowerCase())) return d.error(`\`${d.func}: Invalid option in 1st field at ${inside}\``)

    try {
        switch(options) {
            case "name": result = await guild.edit({
                name: inside.splits[1].addBrackets()
            }).catch(err => {})
            break;
            case "icon": result = await guild.edit({
                icon: inside.splits[1].addBrackets()
            }).catch(err => {})
            break;
            case "systemchannel": result = await guild.edit({
                systemChannel: inside.splits[1].addBrackets()
            }).catch(err => {
                const channel = d.client.channels.cache.get(result);
                if (channel.type !== "text") return d.error(`\`${d.func}: System Channel must be a Text Channel in ${inside}\``)
            })
            break;
            case "updateschannel": result = await guild.edit({
                publicUpdatesChannel: inside.splits[1].addBrackets()
            }).catch(err => {
                const channel = d.client.channels.cache.get(result);
                if(channel.type !== "text") return d.error(`\`${d.func}: The Updates Channel must be a Text Channel in ${inside}\``)
            })
            break;
            case "ruleschannel": result = await guild.edit({
                rulesChannel: inside.splits[1].addBrackets()
            }).catch(err => {
                const channel = d.client.channels.cache.get(result);
                if(channel.type !== "text") return d.error(`\`${d.func}: The Updates Channel must be a Text Channel in ${inside}\``)
            })
            break;
            case "afkchannel": result = await guild.edit({
                afkChannel: inside.splits[1].addBrackets()
            }).catch(err => {
                const channel = d.client.channels.cache.get(result);
                if (channel.type !== "voice") return d.error(`\`${d.func}: AFK Channel must be a Voice Channel in ${inside}\``)
            })
            break;
            case "afktimeout": result = await guild.edit({
                afkTimeout: timeoutOpts[inside.splits[1].addBrackets()]
            }).catch(err => {})
            if (!timeoutOpts[inside.splits[1].addBrackets()]) return d.error(`\`${d.func}: Invalid input in 2nd field at ${inside}\``);
            break;
            case "verificationlevel": result = await guild.edit({
                verificationLevel: verifyOpts[inside.splits[1].addBrackets()]
            }).catch(err => {})
            if (!verifyOpts[inside.splits[1].addBrackets()]) return d.error(`\`${d.func}: Invalid input in 2nd field at ${inside}\``);
            break;
            case "region": result = await guild.edit({
                verificationLevel: regions[inside.splits[1].addBrackets()]
            }).catch(err => {})
            if (!regions[inside.splits[1].addBrackets()]) return d.error(`\`${d.func}: Invalid input in 2nd field at ${inside}\``);
            break;
            case "verificationlvl": result = await guild.edit({
                verificationLevel: verifyOpts[inside.splits[1].addBrackets()]
            }).catch(err => {})
            if (!verifyOpts[inside.splits[1].addBrackets()]) return d.error(`\`${d.func}: Invalid input in 2nd field at ${inside}\``);
            break;
            case "contentfilter": result = await guild.edit({
                explicitContentFilter: explicitOpts[inside.splits[1].addBrackets()]
            }).catch(err => {})
            if (!explicitOpts[inside.splits[1].addBrackets()]) return d.error(`\`${d.func}: Invalid input in 2nd field at ${inside}\`.`);
            break;
            case "notifications": result = await guild.edit({
                defaultMessageNotifications: notifyOpts[inside.splits[1].addBrackets()]
            }).catch(err => {})
            if (!notifyOpts[inside.splits[1].addBrackets()]) return d.error(`\`${d.func}: Invalid input in 2nd field at ${inside}\`.`);
            break;
            default:
            return d.error(`\`${d.func}: Invalid option in ${inside}`)
        };
    } catch  {
        if (!d.message.guild) return d.error(`\`Failed to edit Guild\``)
    }

    if (!result) return d.error(`\`${d.func}: Failed to edit Guild in ${inside}\``)

    return {
        code: code.replaceLast(`$editGuild${inside}`, "")
    }
}
