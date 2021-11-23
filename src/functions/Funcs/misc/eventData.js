module.exports = async d => {
    const data = d.util.openFunc(d);

    try {
        data.result = await eval(`d.data.eventData${data.inside.inside}`)
    } catch (e) {
        data.result = ""
    }

    return {
        code: d.util.setCode(data)
    }
} 