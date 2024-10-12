const {Time} = require("../core/Time.js");
const Interpreter = require("../core/interpreter.js");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID = d.channel?.id, userFilter, time, replies, cmds, errorMsg = "", awaitData = "{}", dm = "false"] = data.inside.splits;

    try {
        awaitData = JSON.parse(awaitData);
    } catch (e) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "AwaitData");
    }

    userFilter = userFilter === "everyone" ? userFilter : userFilter.split(",");

    time = Time.parse(time)?.ms;
    if (!time) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Time");

    cmds = cmds.split(",");
    cmds.forEach((x) => {
        if (!d.client.cmd.awaited.find((y) => y.name.toLowerCase() === x.toLowerCase()))
            return d.aoiError.fnError(d, "custom", {}, "Couldn't Find Awaited Command: " + x);
    });

    replies = replies.split(",");

    let channel;

    if (dm !== "false") {
        const user = await d.util.getUser(d, dm);
        if (!user.dmChannel) {
            channel = await user.createDM();
        } else {
            channel = user.dmChannel;
        }
    } else {
        channel = await d.util.getChannel(d, channelID);
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
        .awaitMessages({ filter, time, max: 1, errors: ["time"] })
        .then(async (collected) => {
            collected = collected.first();
            const c = cmds[replies.length === 1 && replies[0] === "everything" ? 0 : replies.indexOf(collected.content.toLowerCase())];
            const cmd = d.client.cmd.awaited.find((x) => x.name.toLowerCase() === c.toLowerCase());
            await Interpreter(
                d.client,
                collected,
                collected.content.split(" "),
                cmd,
                d.client.db,
                false,
                undefined,
                {...d.data, awaitData: awaitData},
            );
        })
        .catch(async (_) => {
            if (errorMsg !== "") {
                errorMsg = await d.util.errorParser(errorMsg, d);
                d.aoiError.makeMessageError(
                    d.client,
                    channel,
                    errorMsg.data ?? errorMsg,
                    errorMsg.options,
                    d,
                );
            }
        });

    return {
        code: d.util.setCode(data),
    };
};
