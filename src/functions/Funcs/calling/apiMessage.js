const {DataResolver} = require("discord.js");
const {
    EmbedParser,
    ComponentParser,
    FileParser,
} = require("../../../handler/parsers.js");
module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [
        channelId,
        content,
        embeds = "",
        components = "",
        files = "",
        stickers = "",
        allowedMentions = "",
        reply = "",
        returnId = "no",
    ] = inside.splits;
    content = content === "" ? " " : content;
    embeds = embeds === "" ? [] : await EmbedParser(embeds || "");
    components =
        components === "" ? [] : await ComponentParser(components || "", d.client);
    files = files === "" ? [] : await FileParser(files || "");
    for (const file of files) {
        file.file = await DataResolver.resolveFile(file.attachment);
    }
    stickers = stickers === "" ? undefined : stickers.split(",");
    reply = reply.split(":");
    allowedMentions = {
        parse: allowedMentions.split(","),
        repliedUser: reply[1] === "yes",
    };
    reply = {message_id: reply[0] === "" ? undefined : reply[0]};
    const data = {
        content,
        embeds,
        components,
        allowed_mentions: allowedMentions,
        message_reference: reply,
        sticker_ids: stickers,
    };
    const msg = await d.client.api
        .channels(channelId)
        .messages.post({
            data,
            files,
        })
        .catch((err) => {
            d.aoiError.consoleError("$apiMessage", err);
            d.aoiError.fnError(d, "custom", {}, err.message);
        });
    return {
        code: d.util.setCode({
            function: d.func,
            code,
            inside,
            result: returnId === "yes" ? msg?.id : "" || "",
        }),
    };
};
