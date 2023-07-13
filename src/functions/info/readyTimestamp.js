module.exports = async d => {
    const {code} = d.command;
    const result = d.client?.readyTimestamp
    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}
