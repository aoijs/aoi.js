module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...options] = data.inside.splits;

    let opt;
    if (options.length === 1) {
        try {
            opt = JSON.parse(options[0].addBrackets());
            if (!Array.isArray(opt)) opt = [opt];
        } catch (e) {
            console.error(e)
            return d.aoiError.fnError(d, "custom", {}, `Invalid JSON: ${options[0]}`);
        }
    } else {
        opt = [];
        let i = 0,
            u = 0;
        while (i < options.length) {
            opt[u] = {
                name: options[i],
                value: options[i + 1],
            };
            u++;
            i += 2;
        }
    }

    if (opt.length > 25) {
        opt = opt.slice(0, 25);
    }

    await d.data.interaction.respond(opt).catch((e) => {
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Failed to respond with reason: ${e}`,
        );
    });

    return {
        code: d.util.setCode(data),
    };
};
