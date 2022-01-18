const {Perms: Permissions} = require('../../../utils/Constants.js');
module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) d.error(err);

    let [guildId,returnId ="no", name, color, hoist = "no", position, mentionable = "no", ...permissions] = inside.splits;

    const guild = await d.util.getGuild(d, guildId === "" ? d.guild.id : guildId)
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    name = name.addBrackets();
    color = color === "" ? undefined : color
    hoist = hoist === "yes"
    position = isNaN(position) ? 1 : position
    mentionable = mentionable === "yes"
    const wrongPerms = []
    permissions = permissions.map(x => {
        if (isNaN(permissions)) {
            if (Object.keys(Permissions).includes(x)) {
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

    const role = await guild.roles.create({name, color, hoist, permissions, position, mentionable}).catch(e => {
        d.aoiError.fnError(d, "custom", {inside}, "Failed To Create Role With Reason: " + e);
    });

    const result = returnId === "yes" ? role?.id : undefined

    return {
        code: d.util.setCode({function: d.func, code, inside,result})
    }
} 