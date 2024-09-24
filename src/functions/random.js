/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [n1, n2, allow = 'false', random = 'false'] = data.inside.splits;

    const inside = data.inside;

    if (data.inside.splits.length > 4) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Too Many Fields In');

    if (isNaN(Number(n1)) || isNaN(Number(n2)) || Number(n1) >= Number(n2)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number In');

    let n = allow === "true" ? Math.random() * (Number(n2) - Number(n1)) + Number(n1) : Math.round(Math.random() * (Number(n2) - Number(n1))) + Number(n1)

    if (d.randoms[inside] && random !== "true") n = d.randoms[inside]
    else if (random === "true") d.randoms[`${inside}_${Math.floor(Math.random() * 999999)}`] = n
    else d.randoms[inside] = n

    data.result = n;

    return {
        code: d.util.setCode(data)
    }
}
