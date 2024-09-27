/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [entitlementId] = data.inside.splits;

    if (!entitlementId) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid EntitlementId ID");

    await d.client.application.entitlements.deleteTest(entitlementId).catch((e) => {
        return d.aoiError.fnError(d, "custom", {}, e.message);
    });

    return {
        code: d.util.setCode(data)
    };
};
