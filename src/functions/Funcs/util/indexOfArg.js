module.exports = d => {
    const data = d.util.openFunc(d)
    if (data.err) return d.error(data.err)

    const [string, query] = data.inside.splits

    data.result = string.addBrackets().split(" ").indexOf(query.addBrackets()) + 1

    return {
        code: d.util.setCode(data)
    }
}
