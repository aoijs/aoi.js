module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [emoji, id = "global"] = inside.splits;
    emoji = emoji.addBrackets();
    let result;

    if (id === "global") {
        result = d.client.emojis.cache.find(x => x.name.toLowerCase() === emoji.toLowerCase() || x.toString() === emoji || x.id === emoji)?.toString()
    } else {
        result = d.client.guilds.cache.get(id)?.emojis.cache.find(x => x.name.toLowerCase() === emoji.toLowerCase() || x.toString() === emoji || x.id === emoji)?.toString()
    }

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}