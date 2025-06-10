/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [format, separator = ", "] = data.inside.splits;

    if (!d.client.shard) return d.aoiError.fnError(d, "custom", {}, "Your Bot requires sharding to use this function");

    const results = await d.client.shard.broadcastEval((client, args) => {
        const placeholders = {
            "{readyTimestamp}": client.readyTimestamp,
            "{uptime}": client.uptime,
            "{humanizedUptime}": humanize(client.uptime),
            "{guildCount}": client.guilds.cache.size,
            "{userCount}": client.users.cache.size,
            "{ping}": client.ws.ping,
            "{shardId}" : client.shard.ids[0],
        };

        function humanize(ms) {
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (1000 * 60)) % 60);
            const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        return args.format.replace(/{\w+}/g, x => placeholders[x] !== undefined ? placeholders[x] : x);
    }, { context: { format: format.addBrackets() } });

    data.result = results.join(separator);

    return {
        code: d.util.setCode(data)
    };
};
