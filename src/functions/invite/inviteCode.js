const { AoiInviteSystem } = require("../../classes/AoiInviteSystem.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const inviteSystem = d.client.AoiInviteSystem;
    if (!inviteSystem) {
        return d.aoiError.fnError(d, "inviteSystem", { inside: data.inside });
    }

    const invite = d.invite;
    if (!invite || !invite.code) {
        return d.aoiError.fnError(d, "invite", { inside: data.inside });
    }

    const inviteCode = invite.code;

    return {
        code: d.util.setCode(data, inviteCode),
    };
};
