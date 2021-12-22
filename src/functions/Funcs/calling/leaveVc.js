module.exports = async (d) => {
    const {code} = d.util.openFunc(d);

    const state = d.client.voiceManager.servers.get(d.guild.id);
    if (!state)
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Bot is not in any voice channel`,
        );

    state.leaveVc();

    return {
        code: d.util.setCode({function: d.func, code}),
    };
};
