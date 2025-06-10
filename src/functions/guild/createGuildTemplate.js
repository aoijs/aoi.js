/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [ guildID = d.guild?.id, name, description, returnCode = "false" ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);

    await guild.createTemplate(name, description).then(x => {
        data.result = returnCode === "true" ? x.code : null;
    }).catch((e) => {
        return d.aoiFunc.fnError(d, "custom", {}, "Failed To Create Template With Reason: " + e);
    });

    return {
        code: d.util.setCode(data),
    };
}