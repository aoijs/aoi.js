module.exports = async d => {
    const data = d.util.openFunc(d);

    const [option = 'name'] = data.inside.splits;

    data.result = eval(`d.data.newApp?.${option}`);

    return {
        code: d.util.setCode(data)
    }
}