const {Time} = require("../core/Time.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID, messageID, userFilters, time, reactions, awaits, removeReaction = "true", awaitData = "{}", endAwait] = data.inside.splits;

    const channel = d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const msg = await d.util.getMessage(channel, messageID);
    if (!msg) return d.aoiError.fnError(d, "message", {inside: data.inside});

    time = isNaN(time) ? Time.parse(time)?.ms : Number(time);
    
    try {
        awaitData = JSON.parse(awaitData);
    } catch (e) {
        return d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid Data Is Provided In");
    }
    userFilters =
        userFilters === "everyone"
            ? "everyone"
            : userFilters.split(",").map((x) => x.trim());
    reactions = reactions.split(",").map((x) => x.trim());
    awaits = awaits.split(",").map((x) => x.trim());

    if (awaits.some((y) => !d.client.cmd.awaited.find((x) => x.name.toLowerCase() === y.toLowerCase().trim()))) {
        return d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid Awaited Commands Provided In");
    }

    const filter = (reaction, user) =>
        (userFilters === "everyone"
            ? user.id !== d.client.user.id
            : userFilters.includes(user.id)) &&
        reactions.includes(reaction.emoji.toString() || reaction.emoji.id);

    reactions.forEach((x) => {
        msg.react(x).catch((err) => {
            d.aoiError.fnError(d, "custom", {}, `Failed To React With Reaction: ${x} With Reason: ${err}`);
        });
    });

    const collector = msg.createReactionCollector({filter, time});

    collector.on("collect", async (reaction, user) => {
        if (removeReaction === "true") {
            await reaction.users.remove(user.id);
        }

        const index =
            reactions.indexOf(reaction.emoji.id) === -1
                ? reactions.indexOf(reaction.emoji.toString())
                : reactions.indexOf(reaction.emoji.id);

        const cmd = d.client.cmd.awaited.find(
            (x) => x.name.toLowerCase() === awaits[index].toLowerCase(),
        );
        if (!cmd) return;

        await d.interpreter(
            d.client,
            {
                author: user,
                message: msg,
                channel: d.channel,
                guild: d.guild,
                member: (await d.util.getMember(d.guild, user.id)),
                client: d.client,
            },
            [],
            cmd,
            d.client.db,
            false,
            undefined,
            { awaitData },
        );
    });

    if (endAwait) {
        collector.on("finish", async (reaction) => {
            const endCmd = d.client.cmd.awaited.find(
                (x) =>
                    x.name.toLowerCase() === endAwait.trim().addBrackets().toLowerCase(),
            );
            if (!endCmd) return;
            await d.interpreter(
                d.client,
                d.message,
                [],
                d.client.db,
                false,
                undefined,
                { awaitData },
            );
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
