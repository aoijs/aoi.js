module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, type = "PLAYING", status = "online", url, afk = "no"] =
        data.inside.splits;

    try {
        d.client.user.setPresence({
            status: status,
            activities: [
                {
                    name: name.addBrackets(),
                    type,
                    url: url?.addBrackets(),
                },
            ],
            afk: afk === "yes",
        });
    } catch (err) {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            "Failed To Set Status With Reason: " + err,
        );
    }

    return {
        code: d.util.setCode(data),
    };
};
