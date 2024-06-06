module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [emoji, id = "global"] = data.inside.splits;
    emoji = emoji.addBrackets();
    let result;

    if (id === "global") {
        result = (await d.util.getEmoji(d, emoji)).toString();
    } else {
        result = d.client.guilds.cache.get(id)?.emojis.cache.find(x => x.name.toLowerCase() === emoji.toLowerCase() || x.toString() === emoji || x.id === emoji)?.toString()
    }

    data.result = result;

    return {
        code: d.util.setCode(data)
    }
}