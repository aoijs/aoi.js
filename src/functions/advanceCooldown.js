const {Time} = require("../core/Time.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time, id, errorObject = ""] = data.inside.splits;
    let error;

    let cooldown = await d.client.db.get("__aoijs_vars__", "cooldown", id);
    cooldown = cooldown?.value;
    if (!cooldown) {
        cooldown = Date.now() + Time.parse(time).ms;
        d.client.db.set("__aoijs_vars__", "cooldown", id, cooldown);
    } else if (Date.now() < cooldown) {
        if (errorObject.trim() === "") {
        } else {
            const {object, humanize, toString} = Time.format(cooldown - Date.now());
            errorObject = errorObject
                .replaceAll("%time%", humanize())
                .replaceAll("%year%", object.years)
                .replaceAll("%month%", object.months)
                .replaceAll("%week%", object.weeks)
                .replaceAll("%day%", object.days)
                .replaceAll("%hour%", object.hours)
                .replaceAll("%min%", object.minutes)
                .replaceAll("%sec%", object.seconds)
                .replaceAll("%ms%", object.ms)
                .replaceAll("%fullTime%", toString());

            errorObject = await d.util.errorParser(errorObject, d);
            await d.aoiError.makeMessageError(
                d.client,
                d.channel,
                errorObject.data ?? errorObject,
                errorObject.options,
                d
            );
        }
        error = true;
    } else {
        cooldown = Date.now() + Time.parse(time).ms;
        d.client.db.set("__aoijs_vars__", "cooldown", id, cooldown);
    }

    return {
        code: d.util.setCode(data),
        error,
    };
};
