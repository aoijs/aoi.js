module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [option] = data.inside.splits;

    try {
        const evaled = eval(`d.object?.${option}`);
        data.result = (typeof evaled === "object" ? JSON.stringify(evaled, null, 2) : evaled) || "undefined";
    } catch (e) {
        data.result = "undefined"
    }

    return {
        code: d.util.setCode(data)
    }

}