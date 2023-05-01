module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let fields = data.inside.splits;
    let i = 0;

    if (isNaN(fields[0]) || fields[0] < 0) i = -1;

    const index = Number(fields[i] ?? 1) - 1;
    const timestamp = fields[i + 1] ?? Date.now();

    if ( !d.embeds[ index ] ) d.embeds[ index ] = new d.embed();
    
    d.embeds[ index ].setTimestamp( timestamp );
    
    return {
        code: d.util.setCode(data),
        embeds: d.embeds,
    };
};
