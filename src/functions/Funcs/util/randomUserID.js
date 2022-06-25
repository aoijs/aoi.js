module.exports = (d) => {
    const data = d.util.aoiFunc(d);

    const [guildId = "global"] = data.inside.splits;
    if (d.randoms.randomUserId) data.result = d.randoms.randomUserId;
    else {
        if (guildId === "global") data.result = d.client.users.cache.random()?.id;
        else
            data.result = d.client.guilds.cache
                .get(guildId)
                ?.members.cache.random()?.id;
        d.randoms.randomUserId = data.result;
    }
    return {
        code: d.util.setCode(data),
    };
};