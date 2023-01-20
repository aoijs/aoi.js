const {Time} = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [
        channelID,
        messageID,
        filter,
        time,
        reactions,
        commands,
        errorMsg = "",
        data = "",
    ] = inside.splits;
    reactions = reactions.split(",");
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) d.aoiError.fnError(d, "channel", {inside});
    const m = await d.util.getMessage(channel, messageID);
    if (!m) d.aoiError.fnError(d, "message", {inside});
    reactions.forEach((x) => {
        m.react(x).catch((err) =>
            d.aoiError.fnError(d, "custom", {}, err.addBrackets()),
        );
    });

    filter = (r, u) => {
        return (
            (filter === "everyone" ? true : u.id === filter) &&
            (reactions.includes(r._emoji.toString()) ||
                reactions.includes(r._emoji.name) ||
                reactions.includes(r._emoji.id))
        );
    };
    time = Time.parse(time)?.ms;
    if (!time)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Time Provided In");

    commands = commands.split(",");
    commands.forEach((cmd) => {
        if (
            !d.client.cmd.awaited.find(
                (x) => x.name.toLowerCase() === cmd.toLowerCase(),
            )
        )
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Awaited Command: " + cmd + " Doesn't Exist",
            );
    });

    if (data !== "") {
        try {
            data = JSON.parse(data);
        } catch (e) {
            d.aoiError.fnError(d, "custom", {inside}, "Invalid Data Provided In");
        }
    }
    m.awaitReactions({filter, time})
        .then(async (collected) => {
            collected = collected.first();
            // console.log({ collected, filter: filter.toString() });
            const index = reactions.findIndex(
                (r) =>
                    reactions.includes(collected.emoji.toString()) ||
                    reactions.includes(collected.emoji.name) ||
                    reactions.includes(collected.emoji.id),
            );
            const cmd = d.client.awaited.find(
                (x) => x.name.toLowerCase() === commands[index]?.toLowerCase(),
            );
            if (!cmd)
                return d.aoiError.fnError(
                    d,
                    "custom",
                    {},
                    "Invalid Await Command: " + commands[index],
                );
            await d.interpreter(d.client, m, [], cmd, d.client.db, false, undefined, {
                ...d.data,
                awaitData: data,
            });
        })
        .catch(async (err) => {
            console.error(err);
            if (errorMsg !== "") {
                errorMsg = await d.util.errorParser(errorMsg, d);
                const extraOptions = errorMsg.options;
                delete errorMsg.options;
                d.aoiError.makeMessageError(
                    d.client,
                    channel,
                    errorMsg.data ?? errorMsg,
                    {...extraOptions},
                );
            } else d.aoiError.consoleError("$awaitMessageReactions", err);
        });
    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};