const {Permissions: Permissions} = require('../../utils/Constants.js');
module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) d.error(err);

    let [guildID, name, color, position, icon, hoist = "false", unicodeEmoji, mentionable = "false", returnID = "false", reason, ...permissions] = inside.splits;

    const guild = await d.util.getGuild(d, guildID === "" ? d.guild.id : guildID)
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

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
    if (wrongPerms.length) d.aoiError.fnError(d, "custom", {inside}, "Invalid Permissions: " + wrongPerms.join(" , ") + " Provided In");

    const role = await guild.roles.create({name, color, position, icon, hoist, unicodeEmoji, mentionable, reason, permissions}).catch(e => {
        d.aoiError.fnError(d, "custom", {inside}, "Failed To Create Role With Reason: " + e);
    });

    const result = returnID === "true" ? role?.id : undefined

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
} 