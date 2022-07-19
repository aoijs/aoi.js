module.exports = (d) => {
    let data = d.util.aoiFunc(d);

    const [guildID = "global", type = "all"] = data.inside.splits;

    data.result =
        guildID === "global"
            ? type === "all"
                ? d.client.channels.cache.random()?.id
                : d.client.channels.cache
                    .filter((x) => x.type === d.util.channelTypes[type])
                    .random()?.id
            : d.client.guilds.cache
                .get(guildID)
                ?.channels.cache.filter((x) =>
                    type === "all" ? true : x.type === d.util.channelTypes[type],
                )
                .random()?.id;

    if (!d.randoms[`randomChannelId${data.inside.splits}`]) {
        d.randoms[`randomChannelId${data.inside.splits}`] = data.result;
    } else {
        data.result = d.randoms[`randomChannelId${data.inside.splits}`];
    }

    return {
        code: d.util.setCode(data),
    };
};