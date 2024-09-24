const {Permissions} = require("../utils/Constants.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID, roleoruserId, ...perms] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID, true);
    if (!channel)
        return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const pms = perms.map((key) => Permissions[key]);
    if (pms.includes(undefined))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            `Invalid Permissions In`,
        );

    const upms = channel.permissionsFor(roleoruserId);

    if (!upms)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            `Role or User not found`,
        );

    data.result = upms.has(Permissions.administrator) ? true : upms && pms.every((p) => upms.has(p));
    return {
        code: d.util.setCode(data),
    };
};
