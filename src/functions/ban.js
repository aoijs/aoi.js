/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID = d.guild?.id, userID, deleteMessageSeconds = "7", reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const member = await d.util.getUser(guild, userID);
    if (!member) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    const deleteMessageDays = parseInt(deleteMessageSeconds);
    if (isNaN(deleteMessageDays) || deleteMessageDays > 7 || deleteMessageDays < 0)
        return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Day Provided In');

    deleteMessageSeconds = deleteMessageDays * 24 * 60 * 60;

    guild.members
        .ban(userID, {deleteMessageSeconds, reason: reason?.addBrackets()})
        .catch((error) => {
            d.aoiError.fnError(d, 'custom', {}, 'Failed To Ban With Reason: ' + error);
        });

    return {
        code: d.util.setCode(data),
    };
};
