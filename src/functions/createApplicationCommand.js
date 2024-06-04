const { ApplicationCommandType } = require("discord.js");
const { SlashTypes } = require("../utils/InteractionConstants.js");
const parser = require("../events/slashCommandOptionsParser");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, name, description, defaultPermission = "true", dmPermission = "true", type = "slash", ...opts] = data.inside.splits;
    name = name.addBrackets();
    let options;
    let appData;

    if (dmPermission != "true" && dmPermission != "false") return d.aoiError.fnError(d, "custom", {}, "dmPermission expects to be boolean");
    if (defaultPermission != "true" && defaultPermission != "false") return d.aoiError.fnError(d, "custom", {}, "defaultPermission expects to be boolean");

    const guild = guildID === "global" ? undefined : guildID === "custom" ? "custom" : await d.util.getGuild(d, guildID);
    if (!guild && !["global", "custom"].includes(guildID)) return d.aoiError.fnError(d, "guild", { inside: data.inside });
    type = SlashTypes[type] || type;
    if (type === ApplicationCommandType.ChatInput) {
        if (opts.length) {
            if (opts.length === 1) {
                try {
                    options = JSON.parse(opts[0]);
                    options = Array.isArray(options) ? options : [options];
                } catch (e) {
                    if (opts[0].startsWith("{") && opts[0].endsWith("}")) options = await d.util.parsers.SlashOptionsParser(opts[0] || "");
                    else options = await parser(opts);
                }
            } else {
                options = await parser(opts);
            }
        }
    } else {
        description = null;
    }

    if (guild === "custom") {
        appData = d.client.interactionManager.applicationData.get(name.toLowerCase());
        if (!appData) return d.aoiError.fnError(d, "custom", {}, "No Slash Data Present With Following Keyword: " + name.toLowerCase());
    } else {
        appData = {
            data: {
                name: name,
                type,
                description: description?.addBrackets(),
                defaultMemberPermission: defaultPermission === "true",
                dmPermission: dmPermission === "true",
                options
            },
            guildID: guild?.id
        };
    }
    await d.client.application.commands.create(appData.data, appData.guildID).catch((e) => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Application Command With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    };
};
