module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = d.client.token
    return {
        code: d.util.setCode(data)
    }
} 