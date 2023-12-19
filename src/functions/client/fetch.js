module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [method, query, ...properties] = data.inside.splits;

    let result = {};

    try {
        switch (method) {
            case "message":
                result = await d.util.fetchMessage(d.channel, query);
                break;

            case "channel":
                result = await d.util.fetchChannel(d.channel, query);
                break;

            case "user":
                result = await d.util.fetchUser(d.channel, query);
                break;

            case "invite":
                result = await d.client.fetchInvite(d.channel, query);
                break;

            case "guildPreview":
                result = await d.client.fetchGuildPreview(query);
                break;

            case "guildTemplate":
                result = await d.client.fetchGuildTemplate(query);
                break;

            case "premiumStickerPacks":
                result = await d.client.fetchPremiumStickerPacks();
                break;

            case "sticker":
                result = await d.client.fetchSticker(query);
                break;

            case "guildCommand":
                const guildID = await d.util.getGuild(d, query);
                result = await guildID.commands.fetch(properties.join(' '));
                break;

            case "webhook":
                result = await d.client.fetchWebhook(query);
                break;

            case "application":
                result = await d.client.application.fetch(query);
                break;
        }

        for (const property of properties) {
            if (property && result[property] !== undefined) {
                result = result[property];
            } else {
                result = "";
                break;
            }
        }

        data.result = JSON.stringify(result, null, 2);
    } catch (e) {
        d.aoiError.fnError(d, "custom", {}, "Failed To Fetch With Reason: " + e);
        data.result = "";
    }

    return {
        code: d.util.setCode(data)
    };
};
