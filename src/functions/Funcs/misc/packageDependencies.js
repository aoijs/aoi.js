module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = Object.keys(require("../../../../package.json").dependencies).join(", ")

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}