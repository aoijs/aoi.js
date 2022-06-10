module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = d.client.user.id
    return {
        code: d.util.setCode(data)
    }
}