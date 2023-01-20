const {Time} = require("../../../utils/helpers/customParser.js");
module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [time, id, errorObject = ""] = inside.splits;
    let error;

    time = isNaN(time) ? Time.parse(time).ms : time;

    if (!time)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
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
        code: d.util.setCode({function: d.func, code, inside}),
        error,
    };
};
