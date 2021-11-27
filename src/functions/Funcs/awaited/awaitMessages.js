const {Time} = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [
        channelId,
        userFilter,
        time,
        replies,
        cmds,
        errorMsg = "",
        data = "{}",
        dm,
    ] = inside.splits;
    try {
        data = JSON.parse(data);
    } catch (e) {
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Data Provided In");
    }
    errorMsg = await d.util.errorParser(errorMsg, d.client);
    userFilter = userFilter === "everyone" ? userFilter : userFilter.split(",");
    time = Time.parse(time)?.ms;
    if (!time)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Time Provided In");
    cmds = cmds.split(",");
    cmds.forEach((x) => {
        if (
            !d.client.cmd.awaited.find(
                (y) => y.name.toLowerCase() === x.toLowerCase(),
            )
        )
            return d.aoiError.fnError(
                d,
                "custom",
                {},
                "Couldn't Find Awaited Command: " + x,
            );
    });
    replies = replies.split(",");
    let channel;
    if (dm) {
        channel = (await d.util.getUser(d, dm)).dmChannel;
    } else {
        channel = await d.util.getChannel(d, channelId);
    }
    const filter = (m) => {
        return (
            (userFilter === "everyone"
                ? true
                : userFilter.some((id) => id === m.author.id)) &&
            (replies.length === 1 && replies[0] === "everything"
                ? true
                : replies.includes(m.content.toLowerCase()))
        );
    };
    channel
        .awaitMessages({filter, time, max: 1, errors: ["time"]})
        .then(async (collected) => {
            collected = collected.first();
            const c =
                cmds[
                    replies.length === 1 && replies[0] === "everything"
                        ? 0
                        : replies.indexOf(collected.content.toLowerCase())
                    ];
            const cmd = d.client.cmd.awaited.find((x) => x.name.toLowerCase() === c);
            await d.interpreter(
                d.client,
                collected,
                collected.content.split(" "),
                cmd,
                d.client.db,
                false,
                undefined,
                {awaitData: data},
            );
        })
        .catch((_) => {
            if (errorMsg !== "")
                d.aoiError.makeMessageError(
                    d.client,
                    channel,
                    errorMsg,
                    errorMsg.options,
                );
        });
    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
