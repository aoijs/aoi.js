module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [text = d.args.join(" ")] = data.inside.splits;

    data.result = text.addBrackets().length

    return {
        code: d.util.setCode(data)
    }
}