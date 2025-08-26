const { Permissions } = require("../../utils/Constants.js");
const {
    Constants: { HolographicStyle }
} = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const info = data.inside.splits;
    const keys = ["guildId", "name", "colors", "position", "icon", "hoist", "unicodeEmoji", "mentionable", "returnID", "reason", "permissions"];
    const insides = d.util.buildInside(keys, info);

    const guild = await d.util.getGuild(d, insides.guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: insides.guildId });

    if (insides.permissions) {
        const perms = Object.keys(Permissions).map((p) => p.toLowerCase());
        const invalid = insides.permissions
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p && !perms.includes(p.toLowerCase()));
        if (invalid.length) {
            return d.aoiError.fnError(d, "custom", {}, `Invalid permission(s): ${invalid.join(", ")}`);
        }
    }

    let colors;
    if (insides.colors === "Holographic") {
        colors = {
            primaryColor: HolographicStyle.Primary,
            secondaryColor: HolographicStyle.Secondary,
            tertiaryColor: HolographicStyle.Tertiary
        };
    } else if (insides.colors) {
        const __color__ = insides.colors.split(",").map((c) => c.trim());
        colors = {
            primaryColor: hexToNumber(__color__[0]),
            secondaryColor: __color__[1] && hexToNumber(__color__[1]),
            tertiaryColor: __color__[2] && hexToNumber(__color__[2])
        };
    }

    function hexToNumber(hex) {
        if (!hex) return null;
        if (!hex.startsWith("#")) return hex;
        hex = hex.replace(/^#/, "");
        return parseInt(hex, 16);
    }

    await guild.roles
        .create({
            name: insides.name?.addBrackets(),
            colors: colors,
            position: insides.position ? parseInt(insides.position) : undefined,
            icon: insides.icon?.addBrackets(),
            hoist: insides.hoist?.toString().toLowerCase() === "true",
            unicodeEmoji: insides.unicodeEmoji?.addBrackets(),
            mentionable: insides.mentionable?.toString().toLowerCase() === "true",
            reason: insides.reason?.addBrackets(),
            permissions: insides.permissions
                ? insides.permissions
                      .split(",")
                      .map((p) => p.toLowerCase().trim())
                      .filter((p) => Permissions[p])
                      .reduce((acc, perm) => acc | Permissions[perm], 0n)
                : undefined
        })
        .then((role) => {
            data.result = insides.returnID === "true" ? role.id : null;
        })
        .catch((err) => {
            d.aoiError.fnError(d, "custom", {}, "Failed to create role: " + err);
        });

    return {
        code: d.util.setCode(data)
    };
};
