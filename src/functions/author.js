module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let fields = data.inside.splits;
    let i = 0;

    if (isNaN(fields[0]) || fields[0] < 0) i = -1;

    const index = Number(fields[i] ?? 1) - 1;
    const name = fields[i + 1].addBrackets();
    const iconURL = fields[i + 2]?.addBrackets();
    const url = fields[i + 3]?.addBrackets();

    if (!d.embeds[index]) d.embeds[index] = new d.embed();

    d.embeds[index].setAuthor({
        name,
        iconURL,
        url,
    });

    return {
        code: d.util.setCode(data),
        embeds: d.embeds,
    };
};
