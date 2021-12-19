const formatDate = require("../../../handler/FormatDate");

module.exports = (d) => {
    const code = d.command.code,
        r = code.split("$formatDate").length - 1,
        inside = code.split("$formatDate")[r].after();

    const err = d.inside(inside);

    if (err) return d.error(err);

    let [
        date = Date.now().toLocaleString("en-us", {timeZone: d.timezone}),
        format = "dddd, DD MMMM YYYY",
    ] = inside.splits;
    const checkIsValid = new Date(
        isNaN(Number(date)) ? date : Number(date)
    );

    if (isNaN(checkIsValid.getTime())) {
        return d.error(
            `\`${d.func}: Invalid date in ${inside}\``
        );
    }

    return {
        code: code.replaceLast(
            `$formatDate${inside}`,
            format.replace(/\w+/g, (value) =>
                formatDate(value, checkIsValid, d.timezone)
            )
        ),
    };
};
