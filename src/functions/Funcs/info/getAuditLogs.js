module.exports = async (d) => {
    const {AuditLogEvent} = require("discord.js");
    const data = d.util.aoiFunc(d);

    let [
        guildID = d.guild?.id,
        userID = d.author?.id,
        limit = 5,
        action,
        format = "{executor.username}: {target.id} - {action}"
    ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    limit = Number(limit);
    if (isNaN(limit))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Index Provided In"
        );

    const audit = await guild.fetchAuditLogs({
        limit,
        user: userID === "" ? undefined : userID,
        type: action === "" ? undefined : action
    })
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Get Audit Logs With Reason: " + e
            );
        });

    data.result = audit.entries
        .map((logs) => {
                return format
                    .replaceAll(`{executor.username}`, logs.executor.username)
                    .replaceAll(`{executor.mention}`, logs.executor)
                    .replaceAll(`{executor.id}`, logs.executor.id)
                    .replaceAll(`{executor.tag}`, logs.executor.tag)
                    .replaceAll("{target.id}", logs.target.id)
                    .replaceAll("{reason}", logs.reason)
                    .replaceAll("{action}", AuditLogEvent[logs.action])
                    .replaceAll("{id}", logs.id);
            }
        ).join("\n");

    return {
        code: d.util.setCode(data)
    };
};
