module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelResolver, returnSelf = "true"] = data.inside.splits;
    channelResolver = channelResolver.addBrackets();

    data.result = d.util.findChannel(d.client, channelResolver) || (returnSelf === "true" ? d.channel.id : undefined);

    return {
        code: d.util.setCode(data)
    }
} 