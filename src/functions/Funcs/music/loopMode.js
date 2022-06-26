module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [mode = "queue"] = data.inside.splits;

    if (!["song", "queue", "none"].includes(mode))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Type Provided In",
        );

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

    player.loop(mode);

    return {
        code: d.util.setCode(data),
    };
};
