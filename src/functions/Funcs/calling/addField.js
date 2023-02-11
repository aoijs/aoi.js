module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if ( data.err ) return d.error( data.err );
    
    const fields = data.inside.splits;
    let i = 0;

    if (isNaN(fields[0])) i = -1;

    const index = Number(fields[i] ?? 1) - 1;
    const name = fields[i + 1].addBrackets();
    const value = fields[i + 2].addBrackets();
    const inline = fields[i + 3] === "true";

    if (!d.embeds[index]) d.embeds[index] = new d.embed();

    d.embeds[index].addFields({
        name,
        value,
        inline,
    });

    return {
        code: d.util.setCode(data),
        embeds: d.embeds,
    };
};
