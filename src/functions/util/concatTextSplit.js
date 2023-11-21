module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [...text, name = 'main'] = inside.splits;
    text = text.map(x => x.addBrackets());
    d.array[name].concat(text)

    return {
        code: d.util.setCode({function: d.func, code, inside}),
        data: {
            array: d.array
        }
    }
} 