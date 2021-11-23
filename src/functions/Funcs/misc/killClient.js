module.exports = d => {
    const {code} = d.util.openFunc(d);

    d.client.destroy();

    return {
        code: d.util.setCode({function: d.func, code})
    }
}