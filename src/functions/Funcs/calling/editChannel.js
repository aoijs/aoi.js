const {Time} = require("../../../utils/helpers/customParser.js");
module.exports = async (d) => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [channelId, ...fields] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});
    if (fields.length === 1) {
        try {
            fields = JSON.parse(fields[0]);

            channel
                .edit(fields, fields.reason)
                .catch((e) => {
                    d.aoiError.fnError(
                        d,
                        "custom",
                        {},
                        "Failed To Edit Channel With Reason: " + e,
                    );
                });

        } catch {
            let [
                name = "$default",
                type = "$default",
                position = "$default",
                topic = "$default",
                nsfw = "$default",
                bitrate = "$default",
                userLimit = "$default",
                parent = "$default",
                lockPermissions = "$default",
                permissionOverwrites = "$default",
                rateLimitPerUser = "$default",
                defaultAutoArchiveDuration = "$default",
                rtcRegion = "$default",
                reason,
            ] = fields;

            name = name === "$default" ? channel.name : name.addBrackets();
            type = type === "$default" ? channel.type : d.util.channelTypes[type];
            position = position === "$default" ? channel.position : Number(position);
            nsfw = nsfw === "$default" ? channel.nsfw : nsfw === "yes";
            topic = topic === "$default" ? channel.topic : topic.addBrackets();
            bitrate = bitrate === "$default" ? channel.bitrate : Number(bitrate);
            userLimit =
                userLimit === "$default" ? channel.userLimit : Number(userLimit);
            parent = parent === "$default" ? channel.parent : parent;
            lockPermissions =
                lockPermissions === "$default"
                    ? channel.permissionsLocked
                    : lockPermissions === "yes";
            rateLimitPerUser =
                rateLimitPerUser === "$default"
                    ? channel.rateLimitPerUser
                    : Time.parse(rateLimitPerUser).ms;
            permissionOverwrites =
                permissionOverwrites === "$default"
                    ? channel.permissionOverwrites.cache
                    : JSON.parse(permissionOverwrites.addBrackets());
            defaultAutoArchiveDuration =
                defaultAutoArchiveDuration === "$default"
                    ? channel.defaultAutoArchiveDuration
                    : defaultAutoArchiveDuration;
            rtcRegion = rtcRegion === "$default" ? channel.rtcRegion : rtcRegion;

            channel
                .edit({
                    name,
                    type,
                    position,
                    topic,
                    nsfw,
                    bitrate,
                    userLimit,
                    parent,
                    lockPermissions,
                    permissionOverwrites,
                    rateLimitPerUser,
                    defaultAutoArchiveDuration,
                    rtcRegion,
                }, reason)
                .catch((e) => {
                    d.aoiError.fnError(
                        d,
                        "custom",
                        {},
                        "Failed To Edit Channel With Reason: " + e,
                    );
                });
        }
    }

    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};