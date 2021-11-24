module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [index, name, url] = inside.splits;
    index = Number(index) - 1
    if (isNaN(index) || index < 0) d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In")
    if (!d.embeds[index]) d.embeds[index] = new d.embed()
    d.embeds[index].setTitle(name.addBrackets());

    if (url && url.trim() !== '') {
        d.embeds[index].setURL(url.addBrackets());
    }
    return {
        code: d.util.setCode({function: d.func, code, inside}),
        embeds: d.embeds
    }
}