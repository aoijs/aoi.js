const axios = require("axios");
const parser = require("../../handlers/slashCommandOptionsParser");
module.exports = async (d) => {
    const code = d.command.code;
    
    const r = code.split(`$createSlashCommand`)
        .length - 1;
    
    const inside = code.split("$createSlashCommand")[r].after();
    
    let [guildID, name, description, ...opts] = inside.splits;
    
    let options;
    
    if (opts.length) {
        options = parser(opts);
    }
    
    try {
        if (guildID == "global") {
            d.client.emit("checkGlobalSlashCreate", guildID, name, d.client)
            let request = await d.client.api.applications(d.client.user.id)
                .commands.post({
                    data: {
                        name: name
                        , description: description
                        , options: options
                    , }
                })
                .catch((err) => null);
        } else {
            d.client.emit("checkGlobalSlashCreate", guildID, name, d.client)
            let request = await d.client.api.applications(d.client.user.id)
                .guilds(guildID)
                .commands.post({
                    data: {
                        name: name
                        , description: description
                        , options: options
                    , }
                })
                .catch((err) => null);
            
            if (!request) return d.error(`\`SlashError: Failed to create slash command\``);
            
            return {
                code: code.replaceLast(`$createSlashCommand${inside}`, "")
            , };
        }
    } catch (e) {
        return d.error(`\` ${e.message}\``);
    }
};
