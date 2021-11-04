module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let result

    const OPERATORS = /([0-9]|\/|\+|\*|-|%|<|\(|\)|\[|\]|\.)/g

    try {
        const operation = inside.inside.match(OPERATORS).join("")

        if (data.inside.inside.replace(OPERATORS, "").length) return d.error(`❌ Invalid operation in \`$math${data.errinside.total}\``)

        result = eval(operation)
    } catch {
        return d.aoiError.fnError(d, 'custom', {}, `Failed to calculate in`)
    }

    return {
        code: d.command.code.replaceLast(`$math${data.inside.total}`, result)
    }
}