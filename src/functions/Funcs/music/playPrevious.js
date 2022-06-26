module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [type, track] = data.inside.splits;

    if (!d.client.voiceManager)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Voice Class Is Not Initialised",
        );
    const player = d.client.voiceManager.manager.players.get(d.guild.id);
    if (!player)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Client is not connected to Voice/Stage.",
        );

    await player
        .playPrevious();
    data.result = `Playing Previous Track: ${player.queue.current.info?.title}`;

    return {
        code: d.util.setCode(data)
    }
};
