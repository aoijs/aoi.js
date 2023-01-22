
const {SI_SYMBOL} = require("../../../utils/Constants")

module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    const err = d.inside(inside)

    if (err) return d.error(err)

    const abbrNumber = inside.inside.toUpperCase()

    let abbrIndex

    for (let i = SI_SYMBOL.length - 1; i >= 0; i--) {
        const sym = SI_SYMBOL[i]
        if (abbrNumber.endsWith(sym.toUpperCase())) {
            abbrIndex = i
            break
        }
    }

    const abbr = SI_SYMBOL[abbrIndex]
    const number = abbrIndex ? abbrNumber.slice( 0, -abbr.length ) : abbrNumber

    if (isNaN(Number(number))) return d.aoiError.fnError(
        d,
        "custom",
        {inside},
        "Invalid number in"
    )

    const num = parseFloat(number)
    const multiplier = abbrIndex ? 1e3 ** abbrIndex : 1

    const expanded = num * multiplier

    return {
        code: d.util.setCode({
            function: d.func,
            code,
            inside,
            result: `${expanded}`
        })
    }
}

// Usage: $expandNumber[abbrNumber]
// Example: $expandNumber[1.3m]
