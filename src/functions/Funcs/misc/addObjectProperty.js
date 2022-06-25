module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [name, value] = inside.splits;
    if (!d.object) return d.aoiError.fnError(d, "custom", {}, "No Object Present")
    try {
        value = JSON.parse(value)
    } catch (e) {
        value = value
    }
    const object = d.object
    eval(`object.${name} = value`)

    return {
        code: d.util.setCode({function: d.func, inside, code}),
        object,
    }
}