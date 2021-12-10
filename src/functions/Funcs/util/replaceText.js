module.exports = (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [text, replacer, replacedTo, times = "all"] = data.inside.splits;

    if (times === "all") {
        data.result = text
            .addBrackets()
            .replaceAll(replacer.addBrackets(), replacedTo.addBrackets())
            .deleteBrackets();
    } else {
        if (Number(times) === 0) data.result = text.deleteBrackets();
        else if (Number(times) === 1) {
            data.result = text
                .addBrackets()
                .replace(replacer.addBrackets(), replacedTo.addBrackets())
                .deleteBrackets();
        } else {
            const time = Number(times) + 1;
            if (isNaN(time))
                return d.aoiError.fnError(
                    d,
                    "custom",
                    {inside: data.inside},
                    "Invalid Number Provided In",
                );

            const arr = text.addBrackets().split(replacer.addBrackets());
            let sliceTo;
            let slice;
            if (Number(times) > 0) {
                sliceTo = arr.slice(0, time).join(replacedTo.addBrackets());
            } else {
                sliceTo = arr.slice(0, Number(times)).join(replacer.addBrackets());
            }
            if (Number(times) > 0) {
                slice =
                    replacer.addBrackets() + arr.slice(time).join(replacer.addBrackets());
            } else {
                slice =
                    replacedTo.addBrackets() +
                    arr.slice(Number(times)).join(replacedTo.addBrackets());
            }
            data.result = (sliceTo + slice).deleteBrackets();
        }
    }

    return {
        code: d.util.setCode(data),
    };
};
