const { Time } = require("../core/Time.js");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const { code } = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [time, errorObject = ""] = inside.splits;
    let error;

    let cooldown = await d.client.db.get(
        "__aoijs_vars__",
        "cooldown",
        `${d.command.name}_${d.author.id}`,
    );
    cooldown = cooldown?.value;

    if (!cooldown) {
        cooldown = Date.now() + Time.parse(time).ms;
        d.client.db.set(
            "__aoijs_vars__",
            "cooldown",
            `${d.command.name}_${d.author.id}`,
            cooldown,
        );
    } else if (Date.now() < cooldown) {
        if (errorObject.trim() === "") {
        } else {
            const { object, humanize, toString } = Time.format(
                cooldown - Date.now(),
            );
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
            d.aoiError.makeMessageError(
                d.client,
                d.channel,
                errorObject.data ?? errorObject,
                errorObject.options,
                d,
            );
        }
        error = true;
    } else {
        cooldown = Date.now() + Time.parse(time).ms;
        d.client.db.set(
            "__aoijs_vars__",
            "cooldown",
            `${d.command.name}_${d.author.id}`,
            cooldown,
        );
    }
    return {
        code: d.util.setCode({ function: d.func, code, inside }),
        error,
    };
};
