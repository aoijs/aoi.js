module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [hex] = data.inside.splits;
    const regex =  /^#?([0-9A-Fa-f]{3}){1,2}$/;
    
    data.result = regex.test(hex)

    return {
        code: d.util.setCode(data)
    }
}
