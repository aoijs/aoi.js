module.exports = (d) => {
    const code = d.command.code;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let option = inside.inside;
    if (!option) return d.error(`:x: Missing characters in \`$reverse${inside}\``);
    
    let string = option.toString();
    let reverse = string.split("").reverse().join("")

    return {
        code: d.command.code.replaceLast(`$reverse${inside}`, reverse),
    }
}
