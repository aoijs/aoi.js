/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const [guild = d.guild?.id, toString = "false"] = data.inside.splits;

    let emojis = d.client.emojis.cache;

    if (guild && guild !== "global") emojis = emojis.filter((x) => x.guild.id === guild);

    const randomEmoji = emojis.random();
    const result = toString === "true" ? randomEmoji.toString() : randomEmoji.id;

    if (!d.randoms.randomEmoji) d.randoms.randomEmoji = result;

    data.result = result;

    return {
        code: d.util.setCode(data)
    };
};
