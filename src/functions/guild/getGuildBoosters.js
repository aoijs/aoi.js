/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    let data = d.util.aoiFunc(d);
    let [guildId = d.guild?.id, option = "id", sep = ", "] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    const guildBoosters = guild.members.cache.filter((member) => member.premiumSince !== null);

    data.result = guildBoosters.map((member) => {
            if (option.includes("{")) {
                return option.replaceAll(/{(.+?)}/g, (_, prop) => member.user[prop]);
            } else {
                return member.user[option];
            }
        })
        .join(sep)
        .removeBrackets();

    return {
        code: d.util.setCode(data)
    };
};
