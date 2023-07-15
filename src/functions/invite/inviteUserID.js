const { AoiInviteSystem } = require("../../classes/AoiInviteSystem.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    data.result = d.data.inviteData.inviterId;

    return {
        code: d.util.setCode(data),
    };
};
