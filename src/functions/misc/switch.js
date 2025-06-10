const PLACEHOLDER_PATTERN = /\{.*?\}/g

/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d)
    const [value, caseString] = data.inside.splits

    const cases = (caseString.match(PLACEHOLDER_PATTERN) ?? [])
    .map((v) => {
        const [type, value, awaitedName] = v.slice(1, -1).split(":")
        return type === "case" ? { type, value, awaitedName } : { type, awaitedName: value }
    })

    if (cases.length < 1) {
        return d.aoiError.fnError(d, "custom", {}, "You must provide cases to evaluate!")
    }

    const foundCase = cases.find((c) => c.type === "case" && c.value === value)
    const defaultCase = cases.find((c) => c.type === "default")
        
    if (foundCase) {
        const awaitedCommand = d.client.cmd.awaited.find((cmd) => cmd.name.toLowerCase() === foundCase.awaitedName.toLowerCase())
        if (!awaitedCommand) {
            return d.aoiError.fnError(d, "custom", {}, `Invalid awaited command name "${foundCase.awaitedName}" provided.`)
        }

        const result = await d.interpreter(d.client, d.message, d.args, awaitedCommand, d.client.db, true, undefined, d.data)
        data.result = result.code
    }

    if (!foundCase && defaultCase) {
        const awaitedCommand = d.client.cmd.awaited.find((cmd) => cmd.name.toLowerCase() === defaultCase.awaitedName.toLowerCase())
        if (!awaitedCommand) {
            return d.aoiError.fnError(d, "custom", {}, `Invalid awaited command name "${defaultCase.awaitedName}" provided.`)
        }

        const result = await d.interpreter(d.client, d.message, d.args, awaitedCommand, d.client.db, true, undefined, d.data)
        data.result = result.code
    }

    return {
        code: d.util.setCode(data)
    }
}