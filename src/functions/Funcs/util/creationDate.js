const {Time} = require('../../../utils/helpers/customParser.js');
module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    const [id, format = "date"] = inside.splits;

    const Id = await d.util.findId(d, id)
    if (!Id) return d.aoiError.fnError(d, "custom", {inside}, "Invalid Id Provided In");

    let result;
    if (format === "date") result = new Date(Id.createdTimestamp).toLocaleString("en-us", {timeZone: d.timezone ?? "en-us"})
    else if (format === "time-full" || format === "time") result = Time.format((Date.now() - Id.createdTimestamp)).toString()
    else if (format === "time-humanize") result = Time.format((Date.now() - (Id.createdTimestamp) || 0)).humanize()
    else result = Id.createdTimestamp;

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}