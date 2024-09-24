/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [skuId, userOrGuildId = d.author.id, type = "user"] = data.inside.splits;

    if (!skuId) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid SKU ID");

    if (!["guild", "user"].includes(type)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Type, must be either guild or user");

    let hasPremium = false;

    const entitlements = await d.client.application.entitlements.fetch(userOrGuildId);

    if (!entitlements.size) {
        data.result = false;
    } else {
        if (type === "guild") {
            entitlements.forEach(async (entitlement) => {
                if (entitlement.skuId === skuId && entitlement.guildId === userOrGuildId) hasPremium = true;
            });
        } else if (type === "user") {
            entitlements.forEach(async (entitlement) => {
                if (entitlement.skuId == skuId && entitlement.userId === userOrGuildId) hasPremium = true;
            });
        }
    }

    data.result = hasPremium;

    return {
        code: d.util.setCode(data)
    };
};
