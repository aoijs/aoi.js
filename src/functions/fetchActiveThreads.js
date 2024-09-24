/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID = d.channel.id, ...options] = data.inside.splits;
    if (!options.length) options = ["name"]
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const threadData = await channel.threads.fetchActive();

    options = options.reduce((a, v) => ({...a, [v]: threadData.map(x => x[v]).join(" ,  ")}), {});

    data.result = Object.keys(options).length <= 1 ? Object.values(options)[0] : JSON.stringify(options);

    return {
        code: d.util.setCode(data)

    }
}  