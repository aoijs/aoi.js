module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [channelID = d.channel?.id, response = "{mention} ({type}):\nAllowed Perms: {allow}\nDenied Perms: {deny}", sep = " , "] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    let overwrites = [...channel.permissionOverwrites.cache.values()];
    data.result = overwrites.map(x => response.replaceAll("{mention}", x.type === "role" ? `<@&${x.id}>` : `<@&${x.id}>`).replaceAll("{type}", x.type).replaceAll("{allow}", x.allow.toArray().join(" , ")).replaceAll("{deny}", x.deny.toArray().join(" , "))).join(sep);

    return {
        code: d.util.setCode(data)
    }
}