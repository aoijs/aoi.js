/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channel, name, avatar, reason, separator = " , "] = data.inside.splits;

    channel = await d.util.getChannel(d, channel);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    name = name.addBrackets();
    avatar = avatar.trim() === "" ? undefined : avatar.addBrackets();
    let result = await channel.createWebhook({name, avatar, reason}).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Webhook With Reason: " + e);
    });
    data.result = [result.id, result.token].join(separator);

    return {
        code: d.util.setCode(data)
    }
}