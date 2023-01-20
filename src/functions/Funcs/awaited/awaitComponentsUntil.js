const {Time} = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [channelID, messageID, userFilter, time, customIds, awaitCommands, errorMsg = "", data = "",] = inside.splits;
    let chan = await d.util.getChannel(d, channelID);
    if (!chan) return d.aoiError.fnError(d, "channel", {inside});
    const msg = await d.util.getMessage(chan, messageID);
    if (!msg) return d.aoiError.fnError(d, "message", {inside});
    time = Time.parse(time)?.ms;

    if (!time)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
            "Invalid Time Provided In",
        );
    customIds = customIds.split(",");
    errorMsg = await d.util.errorParser( errorMsg, d );
    awaitCommands = awaitCommands.split(",");
    awaitCommands.forEach((x) => {
        if (
            d.client.cmd.awaited.find((y) => y.name.toLowerCase() === x.toLowerCase())
        ) {
        } else {
            return d.aoiError.fnError(
                d,
                "custom",
                {},
                `Could Not Found AwaitedCommand:${x} `,
            );
        }
    });
    if (data !== "") {
        try {
            data = JSON.parse(data);
        } catch (err) {
            return d.aoiError.fnError(
                d,
                "custom",
                {inside},
                `Invalid Data Format Provided In ${inside}`,
            );
        }
    }
    const filter = (int) => {
        return (userFilter === "everyone" ? true : int.user.id === userFilter) &&
            customIds.includes(int.customId);
    };
    msg
        .awaitMessageComponent({filter, time})
        .then(async (int) => {
            const index = customIds.indexOf(int.customId);
            const cmd = awaitCommands[index];
            if (!cmd) return;
            await d.interpreter(
                d.client,
                {
                    message: int.message,
                    guild: int.guild,
                    channel: int.channel,
                    member: int.member,
                    author: int.user,
                    client: d.client,
                },
                int.message?.content.split(" "),
                cmd,
                d.client.db,
                false,
                undefined,
                {interaction: int, awaitData: data},
            );
        })
        .catch((err) => {
            if (errorMsg !== "") {
                const extraOptions = errorMsg.options || {};
                delete errorMsg.options;
                d.aoiError.makeMessageError(
                    d.client,
                    d.channel,
                    errorMsg.data ?? errorMsg,
                    extraOptions,
                );
            } else {
                d.aoiError.consoleError(d.func, err);
            }
        });
    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
