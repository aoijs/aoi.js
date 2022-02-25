module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const [channelId = d.channel?.id, response = "{mention} ({type}):\nAllowed Perms: {allow}\nDenied Perms: {deny}", sep = " , "] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    let overwrites = [...channel.permissionOverwrites.cache.values()];
    const result = overwrites.map(x => response.replaceAll("{mention}", x.type === "role" ? `<@&${x.id}>` : `<@${x.id}>`).replaceAll("{type}", x.type).replaceAll("{allow}", x.allow.toArray().join(" , ")).replaceAll("{deny}", x.deny.toArray().join(" , "))).join(sep);

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}