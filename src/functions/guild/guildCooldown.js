const {Time} = require("../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time, errorObject = ""] = data.inside.splits;
    let error;

    let cooldown = await d.client.db.get(
        d.client.db.tables[0],
        "cooldown",
        `${d.command.name}_${d.guild?.id || "dm"}`,
    );
    if (!cooldown) {
        cooldown = Date.now() + Time.parse(time).ms;
        d.client.db.set(
            d.client.db.tables[0],
            "cooldown",
            `${d.command.name}_${d.guild?.id || "dm"}`,
            cooldown,
        );
    } else if (Date.now() < cooldown.value) {
        if (errorObject.trim() === "") {
        } else {
            const {object, humanize, toString} = Time.format(cooldown.value - Date.now());
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
                d
            );
        }
        error = true;
    } else {
        cooldown = Date.now() + Time.parse(time).ms;
        d.client.db.set(
            d.client.db.tables[0],
            "cooldown",
            `${d.command.name}_${d.guild?.id || "dm"}`,
            cooldown,
        );
    }

    return {
        code: d.util.setCode(data),
        error,
    };
};
