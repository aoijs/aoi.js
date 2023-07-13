module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [text, ...chars] = inside.splits;

    const result = chars.some(x => text.deleteBrackets().includes(x.deleteBrackets()));

    return {
        code: d.util.setCode({function: d.func, code, result, inside})
    }
}