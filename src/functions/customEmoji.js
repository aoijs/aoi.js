/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, id = "global"] = data.inside.splits;

    if (id === "global") {
        const emoji = await d.util.getEmoji(d, name);
        if (!emoji) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Emoji");
        data.result = emoji.toString();
    } else {
        data.result = d.client.guilds.cache.get(id)?.emojis.cache.find(x => x.name.toLowerCase() === name.toLowerCase() || x.toString() === name || x.id === name)?.toString()
    }

    return {
        code: d.util.setCode(data)
    }
}
