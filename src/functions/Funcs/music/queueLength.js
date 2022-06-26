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

    const manager = d.client.voiceManager?.manager.players.get(d.guild?.id);

    data.result = manager ? manager.queue.list.length : 0;

    return {
        code: d.util.setCode(data),
    };
};
