/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [type = "default"] = data.inside.splits;

    const types = d.client.cmd.interaction[type] || d.client.cmd[type];

    if (!types) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Command Type Provided In");

    if (["slash", "modal", "selectMenu", "button"].includes(type)) {
        data.result = d.client.cmd.interaction[type]?.size || 0;
    } else {
        data.result = d.client.cmd[type]?.size || 0;
    }

    return {
        code: d.util.setCode(data)
    };
};
