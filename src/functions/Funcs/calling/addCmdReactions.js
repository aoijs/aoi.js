module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [...reactions] = data.inside.splits;
    reactions = reactions.reverse()
    for (let i = reactions.length - 1; i >= 0; i--) {
        await d.message.react(reactions[i]).catch(err => d.aoiError.fnError(d, "custom", {}, err.message))

    }
    data.result = "";

    return {
        code: d.util.setCode(data)
    }
}