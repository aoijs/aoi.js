module.exports = async d => {
    const data = d.util.aoiFunc(d);

    let [text = d.args.join(" "), sep = " , "] = data.inside.splits;
    text = text.split(" ");

    const emojis = [];

    text.forEach(x => {
        if (x.match(/\p{Emoji}/ug) || d.client.emojis.cache.find(y => y.toString() === x)) emojis.push(x)
    });

    data.result = emojis.join(sep);

    return {
        code: d.util.setCode(data)
    }
} 