module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [webhookId, name, avatar, channelID = d.channel?.id, reason] = data.inside.splits;

    const webhook = await d.client.fetchWebhook(webhookId).catch(e => {
        return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Id Provided In');
    });

    webhook.edit({
        name: name.addBrackets(),
        avatar: avatar.addBrackets(),
        channel: channelID
    }, reason?.addBrackets()).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Modify Webhook With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}