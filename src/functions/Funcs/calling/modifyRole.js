const {ReactionUserManager} = require("discord.js");

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, roleId, ...roleDatas] = data.inside.splits;
    let RoleData;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleId).catch(e => undefined);
    if (!role) return d.aoiError.fnError(d, 'role', {inside: data.inside});

    if (roleDatas.length === 1) {
        try {
            RoleData = JSON.parse(roleDatas[0].addBrackets());
        } catch (e) {
        }
    } else {
        RoleData = {
            name: roleDatas[0]?.addBrackets(),
            color: roleDatas[1]?.addBrackets(),
            hoist: roleDatas[2] === 'true',
            position: roleDatas[3] === '$default' ? role.position : Number(roleDatas[3]),
            mentionable: roleDatas[4] === 'true',
            icon: roleDatas[5]?.addBrackets(),
            unicodeEmoji: roleDatas[6]?.addBrackets()
        }
    }

    role.edit(RoleData).catch(e => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Failed To Modify Role With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}