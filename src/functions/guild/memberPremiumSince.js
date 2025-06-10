/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [ memberID = d.member?.id, guildID = d.guild?.id ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID)

    const member = await d.util.getMember(guild, memberID);

    data.result = member?.premiumSinceTimestamp || 0;

    return {
        code: d.util.setCode(data),
    }
}