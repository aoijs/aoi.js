module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const { code } = d.command;
    if (data.err) return d.error(data.err);

    let [channelID, name, archive = "MAX", type = "public", startMessage, returnID = "false"] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    type = d.util.threadTypes[type];
    if (!type) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Type Provided In");
    if (!["60", "1440", "4320", "10080", "MAX"].includes(archive.toUpperCase())) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Archive Duration Provided In");

    const result = await channel.threads.create({
        name,
        autoArchiveDuration: archive.toUpperCase().replace("MAX", "10080"),
        type,
        startMessage: startMessage?.trim() === "" ? undefined : startMessage
    }).catch(e => {
        return d.aoiError.fnError(d, "custom", {}, "Failed To Create Thread With Reason: " + e);
    });

    data.result = returnID === "true" ? result?.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}