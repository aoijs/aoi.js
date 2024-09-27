const { Time } = require('../core/Time.js');
const { SnowflakeUtil } = require('discord.js');

/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [id, format = "date"] = data.inside.splits;

    if (!id) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Id");

    let result;
    const timestamp = Number(SnowflakeUtil.deconstruct(id).timestamp);
    if (format === "date") result = new Date(timestamp).toLocaleString("en-us", {timeZone: d.timezone ?? "en-us"})
    else if (format === "time-full" || format === "time") result = Time.format((Date.now() - timestamp)).toString()
    else if (format === "time-humanize") result = Time.format((Date.now() - timestamp) || 0).humanize()
    else result = timestamp;

    data.result = result;

    return {
        code: d.util.setCode(data)
    }
}