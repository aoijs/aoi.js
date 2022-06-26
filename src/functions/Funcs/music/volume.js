module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [volume = "getVolume"] = data.inside.splits;
    if (isNaN(volume) && volume !== "getVolume")
        return d.aoiError.fnError(d, "custom", {}, "Invalid Number Provided");

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
    if (volume === "getVolume") data.result = player.volume || 0;
    else player.volume = Number(volume);

    return {
        code: d.util.setCode(data),
    };
};