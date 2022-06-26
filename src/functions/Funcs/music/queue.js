module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [page = 1, limit = 10, response = "[{title}]({url}) | <@{user.id}>"] =
        data.inside.splits;

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
            "Client Isn't Connected To Voice/Stage",
        );

    data.result = player.getQueue(page, limit, response).queue.join("\n");

    return {
        code: d.util.setCode(data),
    };
};
