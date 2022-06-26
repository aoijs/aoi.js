module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [response = "title", position = "current"] = data.inside.splits;

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

    if (position === "current") {
        const trackData = player.queue.current;

        response = response.replace(
            response,
            response.startsWith("user.")
                ? trackData?.requestUser.user[response.split("user.")[1]]
                : response.startsWith("member.")
                    ? trackData?.requestUser[response.split("member.")[1]]
                    : eval(`trackData?.rawInfo.${response}`),
        );
        data.result = response;
    } else if (position === "previous") {
        const trackData = player.queue.previous;
        if (!trackData) return;
        else {
            response = response.replace(
                response,
                response.startsWith("user.")
                    ? trackData.requestUser.user[response.split("user.")[1]]
                    : response.startsWith("member.")
                        ? trackData.requestUser[response.split("member.")[1]]
                        : eval(`trackData.rawInfo.${response}`),
            );
            data.result = response;
        }
    } else {
        const trackData = player.queue.list[position];
        if (!trackData) return;
        response = response.replace(
            response,
            response.startsWith("user.")
                ? trackData.requestUser.user[response.split("user.")[1]]
                : response.startsWith("member.")
                    ? trackData.requestUser[response.split("member.")[1]]
                    : eval(`trackData.rawInfo.${response}`),
        );
        data.result = response;
    }

    return {
        code: d.util.setCode(data),
    };
};