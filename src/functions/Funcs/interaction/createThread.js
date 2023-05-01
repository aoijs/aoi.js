module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [channelID, name, archive = "MAX", type = "public", startMessage, returnId = "false"] = inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    type = d.util.threadTypes[type];
    if (!type) return d.aoiError.fnError(d, "custom", {inside}, "Invalid Type Provided In");
    if (!["60", "1440", "4320", "10080", "MAX"].includes(archive.toUpperCase())) d.aoiError.fnError(d, "custom", {inside}, "Invalid Archive Duration Provided In");

    const result = await channel.threads.create({
        name,
        autoArchiveDuration: archive,
        type,
        startMessage: startMessage?.trim() === "" ? undefined : startMessage
    }).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Thread With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside, result: returnId === "true" ? result?.id : ""})
    }
}