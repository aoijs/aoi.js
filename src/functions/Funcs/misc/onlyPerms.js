const {Perms} = require("../../../utils/Constants.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let error = false;

    const [...stuffs] = data.inside.splits;
    const err = stuffs.pop();
    const errorMsg = await d.util.errorParser(err, d);

    if (stuffs.some((x) => !Perms[x]))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Permission(s) Provided In",
        );

    const memPerms = d.member.permissions.toArray();
    if (memPerms.includes(Perms.admin)) {
    } else if (!stuffs.every((x) => memPerms.includes(Perms[x.trim()]))) {
        error = true;
        if (err?.trim() === "") {
        } else {
            const errorMsg = await d.util.errorParser(err, d);
            d.aoiError.makeMessageError(
                d.client,
                d.channel,
                errorMsg,
                errorMsg.options,
                d,
            );
        }
    }

    return {
        code: d.util.setCode(data),
        error,
    };
};
