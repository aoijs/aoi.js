/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [consumableId, userId = d.author.id] = data.inside.splits;

    if (!consumableId) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid SKU ID");

    const entitlements = await d.client.application.entitlements.fetch(userId);

    if (!entitlements.size) {
        data.result = false;
    } else {
        data.result = entitlements.get(consumableId)?.consumed ?? false
    }

    return {
        code: d.util.setCode(data)
    };
};
