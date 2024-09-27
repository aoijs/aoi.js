/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, force = "false", option = "id", sep = " , "] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    if (force === "true" || !guild.bans.cache) await guild.bans.fetch();

    const bannedUsers = guild.bans.cache;

    if (option.includes("{")) {
        const options = option.match(/{(.*?)}/g);
        data.result = bannedUsers.map((x) => {
            let result = option;
            for (const opt of options) {
                const n = opt.replace(/{|}/g, "");
                if (x.user[n]) result = result.replace(opt, x.user[n].toString());
            }
            return result;
        }).join(sep);
    } else {
        data.result = bannedUsers.map((x) => (option === "mention" ? x.user.toString() : x.user[option])).join(sep);
    }

    return {
        code: d.util.setCode(data)
    };
};