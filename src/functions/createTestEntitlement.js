/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [skuId, userOrGuildId = d.author.id, type = "user", returnId = "true"] = data.inside.splits;

    if (!skuId) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid SKU ID");

    if (!["guild", "user"].includes(type)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Type, must be either guild or user");

    const entitlement = await d.client.application.entitlements.createTest({
        sku: skuId,
        [type]: userOrGuildId
    }).catch(e => {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, e.message);
    })

    data.result = returnId === "true" ? entitlement?.id : null;

    return {
        code: d.util.setCode(data)
    };
};
