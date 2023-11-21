module.exports = d => {
    const {code} = d.util.aoiFunc(d);
    const inside = d.unpack();
    
    let [name = 'main'] = inside.splits;

    return {
        code: d.util.setCode({function: d.func, code, result: d.array[name].length})
    }
}