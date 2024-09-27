const {Time} = require("../core/Time.js");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time, id, errorObject = ""] = data.inside.splits;
    let error;

    time = isNaN(time) ? Time.parse(time).ms : time;

    if (!time)
        return d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            "Invalid Time Provided In",
        );

    let CooldownTable = d.client.cacheManager.caches.cache.cooldowns;
    if (!CooldownTable)
        CooldownTable = d.client.cacheManager.createCache("cache", "cooldowns");

    let cooldown = CooldownTable.get(id);

    if (!cooldown) {
        cooldown = Date.now() + time;
        CooldownTable.set(id, cooldown);
    } else if (Date.now() < cooldown) {
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

        errorObject = await d.util.errorParser(errorObject);
        d.aoiError.makeMessageError(
            d.client,
            d.channel,
            errorObject.data ?? errorObject,
            errorObject.options,
            d,
        );
        error = true;
    } else {
        cooldown = Date.now() + time;
        CooldownTable.set(id, cooldown);
    }

    return {
        code: d.util.setCode(data),
        error,
    };
};
