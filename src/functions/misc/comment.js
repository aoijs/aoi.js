module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [text] = data.inside.splits;
    
    return {
        code: d.util.setCode(data)
    };
}
