module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [channel, name, avatar, reason, separator = " , "] = inside.splits;

    channel = await d.util.getChannel(d, channel);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    name = name.addBrackets();
    avatar = avatar.trim() === "" ? undefined : avatar.addBrackets();
    let result = await channel.createWebhook({name, avatar, reason}).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Webhook With Reason: " + e);
    });
    result = [result.id, result.token].join(separator);

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}