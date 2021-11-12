module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let result

    const OPERATORS = /([0-9]|\/|\+|\*|-|%|<|\(|\)|\[|\]|\.)/g

    try {
        const operation = inside.inside.match(OPERATORS).join("")

        if (operation.replace(OPERATORS, "").trim().length) return d.aoiError.fnError(d,'custom',{inside : data.inside},`Invalid operation in`);

        result = eval(operation)
    } catch {
        return d.aoiError.fnError(d, 'custom', {}, `Failed to calculate in`)
    }

    return {
        code: d.command.code.replaceLast(`$math${data.inside.total}`, result)
    }
}