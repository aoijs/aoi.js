module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    const [...channels] = inside.splits;
    const wrongChannels = []
    const chans = []
    channels.forEach(x => {
        if (!d.client.channels.cache.find(y => y.name.toLowerCase() === x.toLowerCase().addBrackets() || y.id === x.id)) wrongChannels.push(x)
        else chans.push(d.client.channels.cache.find(y => y.name.toLowerCase() === x.toLowerCase().addBrackets() || y.id === x.id))
    })
    if (wrongChannels.length) return d.aoiError.fnError(d, "custom", {inside}, `Invalid Channels : ${wrongChannels.join(" , ")} Provided In`);

    for (let i = chans.length - 1; i >= 0; i--) {
        chans[i].delete().catch(e => {
            d.aoiError.fnError(d, "custom", {}, "Failed To Delete Channel: " + chans[i].name + " With Reason: " + e);
        });

    }

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}