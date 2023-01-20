module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [condition, errorMessage = ""] = inside.splits;

    const checker = {
        a: d.args.length < Number(condition.replace("<", "")),
        b: d.args.length > Number(condition.replace(">", "")),
        c: d.args.length <= Number(condition.replace("<=", "")),
        d: d.args.length >= Number(condition.replace(">=", "")),
        e: d.args.length === Number(condition),
    }
    const check = condition.startsWith("<=") ? checker.c : condition.startsWith(">=") ? checker.d : condition.startsWith("<") ? checker.a : condition.startsWith(">") ? checker.b : checker.e
    if (!check && errorMessage !== "") {
        const senderr = await d.util.errorParser(errorMessage, d)
        d.aoiError.makeMessageError(d.client, d.channel, senderr.data ?? senderr, senderr.options, d)
    }
    return {
        code: d.util.setCode({function: d.func, code, inside}),
        error: !check
    }
}