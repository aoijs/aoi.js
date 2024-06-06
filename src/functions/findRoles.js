module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [
        query,
        limit = 10,
        type = "startsWith",
        res = "{position}) {username}: {id}",
    ] = data.inside.splits;
    query = query.addBrackets();
    if (isNaN(limit))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Limit is Not A Number In",
        );

    limit = Number(limit);

    const result = await d.util.findRoles(d.guild, {query, limit, type});

    const props = res.match(/{([^}]+)}/g);

    data.result = result
        .map((x, y) => {
            let response = res;
            props.forEach((a) => {
                response = response.replaceAll(a, (b) => {
                    if (b === "{position}") return y + 1;
                    else if (b === "{mention}") return x.toString();
                    else {
                        return x[b.replaceAll("{", "").replaceAll("}", "")];
                    }
                });
            });
            return response;
        })
        .join("\n");

    return {
        code: d.util.setCode(data),
    };
};