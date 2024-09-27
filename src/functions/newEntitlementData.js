/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "id"] = data.inside.splits;

    data.result = d.data.newEntitlementData[option];

    return {
        code: d.util.setCode(data)
    };
};
