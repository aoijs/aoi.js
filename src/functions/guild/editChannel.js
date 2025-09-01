const { Time } = require("../../core/Time.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const info = data.inside.splits;
    const keys = [
        "channelId",
        "name",
        "type",
        "position",
        "topic",
        "nsfw",
        "bitrate",
        "userLimit",
        "parent",
        "lockPermissions",
        "permissionOverwrites",
        "rateLimitPerUser",
        "defaultAutoArchiveDuration",
        "rtcRegion",
        "reason"
    ];
    const insides = d.util.buildInside(keys, info);

    const channel = await d.util.getChannel(d, insides.channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    channel
        .edit(
            {
                name: insides.name?.addBrackets(),
                type: insides.type?.toString(),
                position: insides.position ? parseInt(insides.position) : undefined,
                topic: insides.topic?.addBrackets(),
                nsfw: insides.nsfw?.toString().toLowerCase() == "true",
                bitrate: insides.bitrate ? parseInt(insides.bitrate) : undefined,
                userLimit: insides.userLimit ? parseInt(insides.userLimit) : undefined,
                parent: insides.parent || null,
                lockPermissions: insides.lockPermissions?.toString().toLowerCase() === "true",
                permissionOverwrites: insides.permissionOverwrites
                    ? JSON.parse(insides.permissionOverwrites.addBrackets())
                    : undefined,
                rateLimitPerUser: insides.rateLimitPerUser ? Time.parse(insides.rateLimitPerUser)?.ms : undefined,
                defaultAutoArchiveDuration: insides.defaultAutoArchiveDuration,
                rtcRegion: insides.rtcRegion || null,
            },
            insides.reason?.addBrackets() || null
        )
        .catch((e) => {
            d.aoiError.fnError(d, "custom", {}, "Failed To Edit Channel With Reason: " + e);
        });

    return {
        code: d.util.setCode(data)
    };
};
