module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    if (!d.client.voiceManager) {
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            "Voice Class Isn't Initialized.",
        );
    }
    const player = d.client.voiceManager.manager.players.get(d.guild?.id);
    if (!player) {
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            "Client is not connected to Voice/Stage.",
        );
    }

    data.result = player.requestManager._currentDuration;

    return {
        code: d.util.setCode(data),
    };
};
