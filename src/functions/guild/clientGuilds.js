/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    
    let [format = "{position}: {guild.name}", list = "10", sep = ", ", sort = "desc"] = data.inside.splits;

    let guilds;

    if (d.client.shard) {
        guilds = await d.client.shard.broadcastEval(client => Array.from(client.guilds.cache.values()));
        guilds = guilds.reduce((acc, val) => acc.concat(val), []);
    } else {
        guilds = Array.from(d.client.guilds.cache.values());
    }

    if (sort === "asc") {
        guilds.sort((a, b) => a.memberCount - b.memberCount);
    } else if (sort === "desc") {
        guilds.sort((a, b) => b.memberCount - a.memberCount);
    }

    const owners = await Promise.all(guilds.map(guild => d.util.getUser(d, guild.ownerId)));

    const result = [];

    for (let i = 0; i < guilds.length; i++) {
        const guild = guilds[i];
        const owner = owners[i];

        let fm = format;

        const placeholders = {
            "{position}": i + 1,
            "{guild.name}": guild.name,
            "{guild.id}": guild.id,
            "{owner.name}": owner.username,
            "{owner.id}": owner.id,
            "{membersCount}": guild.memberCount,
        };

        for (const r in placeholders) {
            fm = fm.replace(new RegExp(r, "g"), placeholders[r]);
        }

        result.push(fm);
    }

    data.result = result.slice(0, list).join(sep);

    return {
        code: d.util.setCode(data),
    };
};