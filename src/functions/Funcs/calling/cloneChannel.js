module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const [channelID = d.channel.id, name, returnId = "false"] = inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    let result = await channel.clone({name}).catch(err => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Clone Channel With Reason: " + err);
    });

    result = returnId === "true" ? result?.id : undefined;

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}
    