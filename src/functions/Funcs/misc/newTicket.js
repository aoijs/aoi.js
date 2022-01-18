const {Guild} = require("discord.js");

module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [name, msg = "", place = d.guild?.id, returnId = "no", error] =
        data.inside.splits;

    const createAt =
        (await d.util.getChannel(d, place)) || (await d.util.getGuild(d, place));
    if (!createAt)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Id Provided In",
        );

    if (createAt instanceof Guild) {
        const channel = await createAt.channels
            .create(name.addBrackets())
            .catch(async (err) => {
                if (error && error?.trim() !== "") {
                    const ticketError = await d.util.errorParser(error || "", d);
                    d.aoiError.makeMessageError(
                        d.client,
                        d.channel,
                        ticketError,
                        ticketError.options,
                    );
                }
            });
        if (channel) {
            channel.permissionOverwrites
                .edit(d.author.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
                .catch(async (err) => {
                    d.aoiError.fnError(
                        d,
                        "custom",
                        {},
                        "Failed To Update Ticket Permissions With Reason: " + err,
                    );
                });
            if (msg?.trim() !== "") {
                const ticketMsg = await d.util.errorParser(msg.addBrackets(), d);
                channel?.send(ticketMsg).catch((err) => {
                    d.aoiError.fnError(
                        d,
                        "custom",
                        {},
                        "Failed To Send Message In Ticket With Reason: " + err,
                    );
                });
            }
        }
        d.client.db.set(
            d.client.db.tables[0],
            "ticketChannel",
            channel.id,
            channel.id,
        );

        data.result = returnId === "yes" ? channel?.id : undefined;
    } else {
        const channel = await createAt
            .createChannel(name.addBrackets())
            .catch(async () => {
                if (error && error?.trim() !== "") {
                    const ticketError = await d.util.errorParser(error || "", d);
                    d.aoiError.makeMessageError(
                        d.client,
                        d.channel,
                        ticketError,
                        ticketError.options,
                    );
                }
            });

        if (channel) {
            channel.permissionOverwrites
                .edit(d.author.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
                .catch(async (err) => {
                    d.aoiError.fnError(
                        d,
                        "custom",
                        {},
                        "Failed To Update Ticket Permissions With Reason: " + err,
                    );
                });
            if (msg?.trim() !== "") {
                const ticketMsg = await d.util.errorParser(msg.addBrackets(), d);
                channel?.send(ticketMsg).catch((err) => {
                    d.aoiError.fnError(
                        d,
                        "custom",
                        {},
                        "Failed To Send Message In Ticket With Reason: " + err,
                    );
                });
            }
        }
        d.client.db.set(
            d.client.db.tables[0],
            "ticketChannel",
            channel.id,
            channel.id,
        );

        data.result = returnId === "yes" ? channel?.id : undefined;
    }

    return {
        code: d.util.setCode(data),
    };
};
