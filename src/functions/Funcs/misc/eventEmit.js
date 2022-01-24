module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);
    if (!d.client.customEvents) return d.aoiError.fnError(d.func, "custom", {}, "CustomEvent Class Was Not Initialised");

    let [name, ...datas] = data.inside.splits;
    name = name.addBrackets();
    datas = datas.map(x => {
        try {
            return JSON.parse(x)
        } catch (e) {
            return x
        }
    });

    data.result = d.client.customEvents.emit(name, ...datas);

    return {
        code: d.util.setCode(data)
    }
} 
