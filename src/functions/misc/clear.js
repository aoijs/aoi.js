/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID = d.channel?.id, amount, returnCount = "false", bots = "false", unpinned = "false", words, users] = data.inside.splits;

    if (isNaN(amount) || amount < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Amount, must be a number and greater than 0");

    amount = Number(amount);

    if (amount > 100) amount = 100;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    let messages = await channel.messages.fetch({ limit: amount, cache: true }).catch((err) => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Fetch Messages With Reason: " + err);
    });

    if (!messages) return;

    messages = [...messages.values()].filter((x) => {

        if (bots === "true" && !x.author.bot) return false;
        if (unpinned === "true" && x.pinned) return false;
        if (words && !words.split(",").some((word) => x.content.includes(word))) return false;
        return !(users && !users.split(",").some((user) => x.author.id === user));

    });

    const result = await channel.bulkDelete(messages, true).catch((err) => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Message With Reason: " + err);
    });

    data.result = returnCount === "true" ? result.size : null;

    return {
        code: d.util.setCode(data)
    };
};
