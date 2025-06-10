/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [userID, nickname, reason] = data.inside.splits;

    const member = await d.util.getMember(d.guild, userID);
    if (!member) return d.aoiError.fnError(d, "member", {inside: data.inside});

    await member.setNickname(nickname === "" ? null : nickname.addBrackets(), reason);

    return {
        code: d.util.setCode(data),
    };
};
