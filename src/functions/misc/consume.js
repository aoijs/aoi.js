/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [consumableId] = data.inside.splits;

    if (!consumableId) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Consumeable ID");

    // cache doesn't refresh after purchase, so we need to fetch it again ;)
    await d.client.application.entitlements.consume(consumableId);
    await d.client.application.entitlements.fetch();

    return {
        code: d.util.setCode(data)
    };
};
