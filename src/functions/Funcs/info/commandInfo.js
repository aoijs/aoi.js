module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [name, option] = inside.splits;

    const cmd = d.client.cmd.default.find(x => (x.name.toLowerCase() === name.toLowerCase()) || (Array.isArray(x.aliases) ? x.aliases?.includes(name.toLowerCase()) : (x.aliases?.toLowerCase() === name.toLowerCase())));

    let result;
    try {
        result = eval(`cmd?.${option}`)
    } catch (e) {
        result = ""
    }

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
} 