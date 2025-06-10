const { Guild } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, message, parentId = d.guild?.id, returnID = "false", error] = data.inside.splits;

    if (!name) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Channel Name Provided In");

    const createAt = (await d.util.getChannel(d, parentId)) || (await d.util.getGuild(d, parentId));
    
    if (!createAt) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid parentId Provided In");

    let channel;

    if (createAt instanceof Guild) {
        channel = await createAt.channels
            .create({ name: name.addBrackets() })
            .catch(async (err) => {
                if (error && error?.trim() !== "") {
                    const ticketError = await d.util.errorParser(error.addBrackets(), d);
                    await d.aoiError.makeMessageError(
                        d.client,
                        d.channel,
                        ticketError.data ?? ticketError,
                        ticketError.options,
                    );
                } else {
                    return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Failed To Create Channel Wih Reason: " + err);
                }
            });

        data.result = returnID === "true" ? channel?.id : undefined;
    } else {
        channel = await createAt
            .children.create({ name: name.addBrackets() })
            .catch(async (err) => {
                if (error && error?.trim() !== "") {
                    const ticketError = await d.util.errorParser(error, d);
                    await d.aoiError.makeMessageError(
                        d.client,
                        d.channel,
                        ticketError.data ?? ticketError,
                        ticketError.options,
                    );
                } else {
                    return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Failed To Create Channel Wih Reason: " + err);
                }
            });

        data.result = returnID === "true" ? channel?.id : undefined;
    }

    if (channel) {
        await d.client.db.set(
            "__aoijs_vars__",
            "ticketChannel",
            channel.id,
            channel.id,
        );

        channel.permissionOverwrites
            .edit(d.author.id, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true,
            })
            .catch((err) => {
                return d.aoiError.fnError(d, "custom", {}, "Failed To Update Ticket Permissions With Reason: " + err);
            });
        if (message && message.trim() !== "") {
            const ticketMsg = await d.util.errorParser(message.addBrackets(), d);
            try {
                await d.aoiError.makeMessageError(
                    d.client,
                    channel,
                    ticketMsg.data ?? ticketMsg,
                    ticketMsg.options,
                );
            } catch (err) {
                return d.aoiError.fnError(d, "custom", {}, "Failed To Send Message In Ticket With Reason: " + err);
            }
        }
    }

    return {
        code: d.util.setCode(data),
    };
};