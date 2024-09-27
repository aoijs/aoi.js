const { Time } = require("../core/Time.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [
        channelID,
        messageID,
        userFilter,
        reactionTimeout,
        reactionEmojis,
        awaitedCommands,
        allowOnce = "true",
        errorMessage = "",
        awaitedData = "",
    ] = data.inside.splits;

    reactionEmojis = reactionEmojis.split(",");
    const channel = await d.util.getChannel(d, channelID);

    if (!channel) d.aoiError.fnError(d, "channel", { inside: data.inside });
    const message = await d.util.getMessage(channel, messageID);

    if (!message) d.aoiError.fnError(d, "message", { inside: data.inside });

    reactionEmojis.forEach((emoji) => {
        message.react(emoji).catch((err) =>
            d.aoiError.fnError(d, "custom", {}, err.addBrackets())
        );
    });

    const filter = (reaction, user) => {
        return (
            (userFilter === "everyone" ? true : user.id === userFilter) &&
            (reactionEmojis.includes(reaction._emoji.toString()) ||
                reactionEmojis.includes(reaction._emoji.name) ||
                reactionEmojis.includes(reaction._emoji.id))
        );
    };
    const timeout = Time.parse(reactionTimeout)?.ms;
    if (!timeout) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Time");

    awaitedCommands = awaitedCommands.split(",");
    awaitedCommands.forEach((command) => {
        if (!d.client.cmd.awaited.find((x) => x.name.toLowerCase() === command.toLowerCase()))
            return d.aoiError.fnError(d, "custom", {}, "Awaited Command: " + command + " Doesn't Exist");
    });

    if (awaitedData !== "") {
        try {
            awaitedData = JSON.parse(awaitedData);
        } catch (e) {
            d.aoiError.fnError(
                d,
                "custom",
                { inside: data.inside },
                "AwaitData"
            );
        }
    }

    let reactionCollected = false;
    let reactionCollector;

    if (allowOnce === "true") {
        reactionCollector = message.createReactionCollector({
            max: 1,
            filter,
            time: timeout,
        });
    } else {
        reactionCollector = message.createReactionCollector({
            filter,
            time: timeout,
        });
    }

    reactionCollector.on("collect", async (collected) => {
        reactionCollected = true;
        const index = reactionEmojis.findIndex(
            (emoji) =>
                reactionEmojis.includes(collected.emoji.toString()) ||
                reactionEmojis.includes(collected.emoji.name) ||
                reactionEmojis.includes(collected.emoji.id)
        );
        const awaitedCommand = d.client.cmd.awaited.find(
            (x) =>
                x.name.toLowerCase() ===
                awaitedCommands[index]?.toLowerCase()
        );
        if (!awaitedCommand)
            return d.aoiError.fnError(
                d,
                "custom",
                { inside: data.inside },
                "Awaited Command: " + awaitedCommands[index]
            );
        await d.interpreter(
            d.client,
            message,
            [],
            awaitedCommand,
            d.client.db,
            false,
            undefined,
            {
                ...d.data,
                awaitData: awaitedData,
            }
        );
    });

    reactionCollector.on("end", async () => {
        if (!reactionCollected) {
            errorMessage = await d.util.errorParser(errorMessage, d);
            const extraOptions = errorMessage.options;
            delete errorMessage.options;
            d.aoiError.makeMessageError(
                d.client,
                channel,
                errorMessage.data ?? errorMessage,
                { ...extraOptions }
            );
        }
    });

    reactionCollector.on("error", async (err) => {
        console.error(err);
        if (errorMessage !== "") {
            errorMessage = await d.util.errorParser(errorMessage, d);
            const extraOptions = errorMessage.options;
            delete errorMessage.options;
            d.aoiError.makeMessageError(
                d.client,
                channel,
                errorMessage.data ?? errorMessage,
                { ...extraOptions }
            );
        } else d.aoiError.consoleError("$awaitMessageReactions", err);
    });

    return {
        code: d.util.setCode(data),
    };
};
