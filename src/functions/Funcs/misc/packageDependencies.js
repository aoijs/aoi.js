module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = Object.keys(require("../../../../package.json").dependencies).join(", ")
    return {
        code: d.util.setCode(data)
    }
}