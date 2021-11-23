const {Invite} = require("../../../utils/helpers/functions.js");

module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [code, option = "uses"] = data.inside.splits;

    const invite = await d.client.fetchInvite(code.addBrackets()).catch((e) => {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            `Failed To Get Invite Data With Reason: ${e}`,
        );
    });

    const inviteData = Invite(invite);

    data.result = inviteData[option.addBrackets()];

    return {
        code: d.util.setCode(data),
    };
};
