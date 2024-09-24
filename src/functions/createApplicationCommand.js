const { SlashTypes, ContextTypes, IntegrationTypes } = require("../utils/InteractionConstants.js");
const { Permissions } = require("../utils/Constants.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, name, description, defaultMemberPermissions = "", integrationType = "", contexts = "all", type = "slash", options] = data.inside.splits;

    const guild = guildID === "global" ? undefined : await d.util.getGuild(d, guildID);
    if (!guild && guildID !== "global") return d.aoiError.fnError(d, "guild", { inside: data.inside });

    const appContext = contexts === "all" || contexts.trim() === "" ? [ContextTypes.botdm, ContextTypes.dm, ContextTypes.guild] : contexts.split(",").map((x) => ContextTypes[x]);

    const appIntegrationType =
        integrationType === "all" || integrationType.trim() === "" ? [IntegrationTypes.guild, IntegrationTypes.user] : integrationType.split(",").map((x) => IntegrationTypes[x]);

    if (appContext.includes(undefined)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Context, valid options: " + Object.keys(ContextTypes).join(","));

    const appPermissions = defaultMemberPermissions.split(",").map((x) => Permissions[x]);

    const appData = {
        data: {
            name: name,
            type: SlashTypes[type] || type,
            description: description?.addBrackets(),
            defaultMemberPermissions: appPermissions.includes(undefined) ? null : appPermissions,
            contexts: appContext,
            integrationTypes: appIntegrationType,
            options: options ? JSON.parse(options) : []
        },
        guildID: guild?.id
    };

    await d.client.application.commands.create(appData.data, appData.guildID).catch((e) => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Application Command With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    };
};
