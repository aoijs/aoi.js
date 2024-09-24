const {ActivityTypeAvailables} = require("../utils/Constants");
/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, type = "playing", status = "online", url, afk = "false"] =
        data.inside.splits;

    const lowercaseType = type.toLowerCase();

    const state = lowercaseType === "custom" ? { state: name.addBrackets() } : {};

    try {
        const typeValue = ActivityTypeAvailables[lowercaseType] || ActivityTypeAvailables.playing;

        d.client.user.setPresence({
            status,
            activities: [
                {
                    name: name.addBrackets(),
                    ...state,
                    type: typeValue,
                    url: url?.addBrackets(),
                },
            ],
            afk: afk === "true",
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
