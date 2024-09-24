/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [condition, errorMessage = ""] = data.inside.splits;

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
        await d.aoiError.makeMessageError(d.client, d.channel, senderr.data ?? senderr, senderr.options, d)
    }
    return {
        code: d.util.setCode(data),
        error: !check
    }

}