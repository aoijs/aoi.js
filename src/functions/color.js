module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let fields = data.inside.splits;
    let i = 0;

    if (isNaN(fields[0]) || fields[0] < 1 || fields[0] > 10) i = -1;

    const index = Number(fields[i] ?? 1) - 1;
    const color = fields[i + 1].addBrackets();

    if (!d.embeds[index]) d.embeds[index] = new d.embed();

    d.embeds[index].setColor(color);

    return {
        code: d.util.setCode(data),
        embeds: d.embeds,
    };
};
