module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [type = "ws"] = data.inside.splits;

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

    data.result = player.connection.ping[type];

    return {
        code: d.util.setCode(data),
    }

}