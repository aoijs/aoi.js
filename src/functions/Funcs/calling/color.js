module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [index, color] = inside.splits;

    if (isNaN(index) || index < 1 || index > 10) return d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In");
    index = index - 1

    if (!d.embeds[index]) d.embeds[index] = new d.embed();
    d.embeds[index].setColor(color.addBrackets());

    return {
        code: d.util.setCode({function: d.func, code, inside}),
        embeds: d.embeds
    }
}