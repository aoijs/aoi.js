module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji] = data.inside.splits;

    data.result = /\p{Extended_Pictographic}/u.test(emoji.addBrackets());

    return {
        code: d.util.setCode(data)
    }
}