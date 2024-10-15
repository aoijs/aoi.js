const { PollLayoutType } = require("discord.js");
const { Time } = require("../core/Time.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelId = d.channel?.id, question, duration, allowMultiselect = "false", ...answers] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);

    try {
        answers = JSON.parse(answers);
    } catch {
        const time = Time.parse(duration)?.ms / 3600000;

        if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });
        if (!time) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Time Provided In");
        if (Math.floor(time) > 168) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Poll duration must be less than or equal to 7 days");
        if (Math.floor(time) < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Poll duration must be longer than or equal 1 hour");

        answers = answers.map(async (x) => {
            const answer = x.split(":");
            let emoji = answer[1];

            if (emoji) {
                emoji = (await d.util.getEmoji(d, emoji.addBrackets()))?.id;
                if (!emoji) emoji = answer[1].addBrackets().trim();
            }

            return {
                text: answer[0],
                emoji: emoji || null
            };
        });

        answers = await Promise.all(answers);

        if (answers.length > 10) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Poll answers must be less than or equal to 10");

        duration = time;
    }

    channel.send({
        poll: {
            question: { text: question },
            duration,
            allowMultiselect: allowMultiselect === "true",
            layout: PollLayoutType.Default,
            answers
        }
    });

    return {
        code: d.util.setCode(data)
    };
};