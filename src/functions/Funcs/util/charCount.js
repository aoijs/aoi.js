module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const [text = d.args.join(" ")] = inside.splits;

    return {
        code: d.util.setCode({function: d.func, code, inside, result: text.addBrackets().length})
    }
}