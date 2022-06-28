const {Time} = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelId, messageId, userFilters, time, reactions, awaits, removeReaction = "yes", awaitData = "{}", endAwait,] = data.inside.splits;

    const channel = d.util.getChannel(d, channelId);
    if (!channel)
        return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const msg = await d.util.getMessage(channel, messageId);
    if (!msg) return d.aoiError.fnError(d, "message", {inside: data.inside});

    time = isNaN(time) ? Time.parse(time)?.ms : Number(time);
    try {
        awaitData = JSON.parse(awaitData);
    } catch (e) {
        d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Data Is Provided In",
        );
    }
    userFilters =
        userFilters === "everyone"
            ? "everyone"
            : userFilters.split(",").map((x) => x.trim());
    reactions = reactions.split(",").map((x) => x.trim());
    awaits = awaits.split(",").map((x) => x.trim());

    if (
        awaits.some(
            (y) =>
                !d.client.cmd.awaited.find(
                    (x) => x.name.toLowerCase() === y.toLowerCase().trim(),
                ),
        )
    ) {
        d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Awaited Commands Provided In",
        );
    }

    const filter = (r, u) =>
        (userFilters === "everyone"
            ? u.id !== d.client.user.id
            : userFilters.includes(u.id)) &&
        reactions.includes(r.emoji.toString() || r.emoji.id);

    reactions.forEach((x) => {
        msg.react(x).catch((err) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed To React With Reaction: ${x} With Reason: ${err}`,
            );
        });
    });

    const collector = msg.createReactionCollector({filter, time});

    collector.on("collect", async (r, u) => {
        if (removeReaction === "yes") {
            await r.users.remove(u.id);
        }

        const index =
            reactions.indexOf(r.emoji.id) === -1
                ? reactions.indexOf(r.emoji.toString())
                : reactions.indexOf(r.emoji.id);

        const cmd = d.client.cmd.awaited.find(
            (x) => x.name.toLowerCase() === awaits[index].toLowerCase(),
        );
        if (!cmd) return;

        await d.interpreter(
            d.client,
            d.message,
            [msg.id],
            cmd,
            d.client.db,
            false,
            undefined,
            {awaitData},
        );
    });

    if (endAwait) {
        collector.on("finish", async (r) => {
            const endCmd = d.client.cmd.awaited.find(
                (x) =>
                    x.name.toLowerCase() === endAwait.trim().addBrackets().toLowerCase(),
            );
            if (!endCmd) return;
            await d.interpreter(
                d.client,
                d.message,
                [msg.id],
                d.client.db,
                false,
                undefined,
                {awaitData},
            );
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
