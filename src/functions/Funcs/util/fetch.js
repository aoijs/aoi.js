module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [method, query, morequery] = data.inside.splits;

    try {
        switch (method) {
            case "message":
                data.result = await d.util.fetchMessage(d.channel, query)
                break;

            case "channel":
                data.result = await d.util.fetchChannel(d, query)
                break;

            case "user":
                data.result = await d.util.fetchUser(d, query)
                break;

            case "invite":
                data.result = await d.client.fetchInvite(query)
                break;

            case "webhook":
                data.result = await d.client.fetchWebhook(query)
                break;

            case "application":
                data.result = await d.client.application.fetch()
                break;

            case "command":
                data.result = await d.client.application.commands.fetch(query)
                break;


            case "guildPreview":
                data.result = await d.client.fetchGuildPreview(query)
                break;

            case "guildTemplate":
                data.result = await d.client.fetchGuildTemplate(query)
                break;

            case "premiumStickerPacks":
                data.result = await d.client.fetchPremiumStickerPacks()
                break;

            case "sticker":
                data.result = await d.client.fetchSticker(query)
                break;
            case 'guildCommand': {
                const guildID = await d.util.getGuild(d, query)
                data.result = await guildID.commands.fetch(morequery)
                break;
            }
            case "default":
                d.aoiError.fnError(d, "option", {inside: data.inside})
                break;
        }
        data.result = JSON.stringify(data.result, null, 2);
    } catch (e) {
        d.aoiError.fnError(d, "custom", {}, "Failed To Fetch With Reason: " + e);
        data.result = ""
    }

    return {
        code: d.util.setCode(data)
    }
}