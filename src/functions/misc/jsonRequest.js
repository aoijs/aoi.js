/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [link, property = "", error, ...heads] = data.inside.splits;
    let headers;

    if (heads.length === 0) headers = {};
    else if (heads.length >= 1) {
        try {
            headers = JSON.parse(heads[0].addBrackets());
        } catch (e) {
            for (let head of heads) {
                head = head.split(":");

                headers[head[0].addBrackets()] = head[1].addBrackets();
            }
        }
    }

    let res = await fetch(link.addBrackets(), {
        method: "GET",
        headers: headers
    }).catch(async (e) => {
        if (!error || error === "$default") {
            return { error: `Failed To Request To API With Reason: ${e}` };
        } else {
            const jsonError = await d.util.errorParser(error, d);
            d.aoiError.makeMessageError(d.client, d.channel, jsonError.data ?? jsonError, jsonError.options);
            return { error: `Failed To Request To API With Reason: ${e}` };
        }
    });

    try {
        res = await res.json();

        const value = eval(`res?.${property?.addBrackets()}`);
        data.result =
            property?.trim() === ""
                ? JSON.stringify(res, null, 2)
                : (typeof value === "object" && value !== null)
                  ? JSON.stringify(value, null, 2)
                  : value;
    } catch (e) {
        data.result = res;
    }

    return {
        code: d.util.setCode(data)
    };
};
