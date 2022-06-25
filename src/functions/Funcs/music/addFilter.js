module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [filter] = data.inside.splits;

    try {
        filter = JSON.parse(filter);
    } catch (_) {
        return d.aoiError.fnError(
            d,
            "custom",
            {
                inside: data.inside,
            },
            "Invalid Filter Provided In",
        );
    }
    const filters = filter;
    for (const f of Object.keys(filter)) {
        if (d.util.audioFilters[f]) {
            const fi = d.util.audioFilters[f](filter[f]);
            filter = {...filter, ...fi};
            delete filter[f];
        }
    }

    if (!d.client.voiceManager)
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            "Voice Class Is Not Initialised.",
        );

    const player = d.client.voiceManager.manager.players.get(d.guild?.id);
    if (!player)
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            "Client is not connected to Voice/Stage.",
        );
    await player.filterManager.addFilters(filter);

    data.result = JSON.stringify(filters, null, 2);

    return {
        code: d.util.setCode(data),
    };
};