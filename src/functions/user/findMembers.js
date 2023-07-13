module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [query, limit = 10, type = "startsWith", force = "false", res = "{position}) {username}: {id}"] = data.inside.splits;
    query = query.toLowerCase().addBrackets();
    if (isNaN(limit)) return d.aoiError.fnError(d, "custom", {inside: data.inside}, "Limit is Not A Number In");

    limit = Number(limit);

    data.result = await d.util.getMembers(d.guild, {query, limit, type}, force === "true");

    data.result = data.result.map((x, y) => {
        return res.replaceAll("{username}", x.user.username)
            .replaceAll("{tag}", x.user.tag)
            .replaceAll("{nick}", x.displayName)
            .replaceAll("{position}", y + 1)
            .replaceAll("{id}", x.user.id)
    }).join("\n");

    return {
        code: d.util.setCode(data)
    }
} 