module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [index, timestamp = Date.now()] = inside.splits;
    index = Number(index) - 1;
    if (isNaN(index) || index < 0)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In");

    if (!d.embeds[index]) d.embeds[index] = new d.embed();
    d.embeds[index].setTimestamp(Number(timestamp));
    return {
        code: d.util.setCode({function: d.func, inside, code, result: ""}),
        embeds: d.embeds,
    };
};
