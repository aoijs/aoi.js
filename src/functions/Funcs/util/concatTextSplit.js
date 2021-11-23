module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [...text] = inside.splits;
    text = text.map(x => x.addBrackets());
    d.array.concat(text)

    return {
        code: d.util.setCode({function: d.func, code, inside}),
        data: {
            array: d.array
        }
    }
} 