module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err)

    let [index, url] = data.inside.splits;
    index = index - 1;
    if (isNaN(index) || index < 0 || index > 10) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Index Provided In");

    if (!d.embeds[index]) d.embeds[index] = new d.embed();
    d.embeds[index].setImage(url.addBrackets());

    return {
        code: d.util.setCode(data),
        embeds: d.embeds
    }
}
