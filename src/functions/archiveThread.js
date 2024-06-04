module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [threadID, channelID = d.channel.id, archive = "true", reason] =
        data.inside.splits;
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const thread = await channel.threads.fetch(threadID).catch((e) => {
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Failed To Fetch Thread With Reason : ${e.message}`,
        );
    });
    thread.setArchived(archive === "true", reason?.addBrackets()).catch((e) => {
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Failed To Set Archive With Reason : ${e.message}`,
        );
    });

    return {
        code: d.util.setCode(data),
    };
};