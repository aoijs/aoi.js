module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.message.isAutocomplete ?? false
    return {
        code: d.util.setCode(data)
    }
}