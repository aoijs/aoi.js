module.exports = async d => {
    const {name, code} = d.command;

    return {
        code: d.util.setCode({function: d.func, code, result: code})
    }
}