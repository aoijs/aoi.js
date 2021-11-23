module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [...reactions] = inside.splits;
    reactions = reactions.reverse()
    for (let i = reactions.length - 1; i >= 0; i--) {
        await d.message.react(reactions[i]).catch(err => d.aoiError.fnError(d, "custom", {}, err.message))

    }
    return {
        code: d.util.setCode({function: d.func, code, inside, result: ""})
    }
}