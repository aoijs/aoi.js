module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    const [...emojis] = inside.splits;
    const wrongEmojis = []
    const emos = []
    emojis.forEach(x => {
        if (!d.client.emojis.cache.find(y => y.name.toLowerCase() === x.toLowerCase().addBrackets() || y.id === x.id || y.toString() === x)) wrongEmojis.push(x)
        else emos.push(d.client.emojis.cache.find(y => y.name.toLowerCase() === x.toLowerCase().addBrackets() || y.id === x.id || y.toString() === x))
    })
    if (wrongEmojis.length) return d.aoiError.fnError(d, "custom", {inside}, `Invalid Emojis : ${wrongEmojis.join(" , ")} Provided In`);

    for (let i = emos.length - 1; i >= 0; i--) {
        emos[i].delete().catch(e => {
            d.aoiError.fnError(d, "custom", {}, "Failed To Delete Emoji: " + emos[i].name + " With Reason: " + e);
        });

    }

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}