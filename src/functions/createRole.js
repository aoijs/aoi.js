const {Permissions: Permissions} = require('../utils/Constants.js');
/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, name, color, position, icon, hoist = "false", unicodeEmoji, mentionable = "false", returnID = "false", reason, ...permissions] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID === "" ? d.guild.id : guildID)
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    name = name.addBrackets();
    color = color === "" ? undefined : color
    position = isNaN(position) ? 1 : position
    icon = icon === "" ? undefined : icon
    unicodeEmoji = unicodeEmoji === "" ? undefined : unicodeEmoji
    hoist = hoist === "true"
    mentionable = mentionable === "true"
    const wrongPerms = []
    permissions = permissions.map(x => {
        if (isNaN(permissions)) {
            if (Object.values(Permissions).includes(x)) {
                return x;
            } else if (Permissions[x]) {
                return Permissions[x];
            } else {
                wrongPerms.push(x)
            }
        } else {
            return x
        }
    });
    if (wrongPerms.length) d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Permissions: " + wrongPerms.join(" , ") + " Provided In");

    const role = await guild.roles.create({name, color, position, icon, hoist, unicodeEmoji, mentionable, reason, permissions}).catch(e => {
        d.aoiError.fnError(d, "custom", { inside: data.inside }, "Failed To Create Role With Reason: " + e);
    });

    data.result = returnID === "true" ? role?.id : undefined

    return {
        code: d.util.setCode(data)
    }
} 