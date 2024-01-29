module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = new Date(new Date().toLocaleString('en-us', {timeZone: d.timezone})).getSeconds();

    return {
        code: d.util.setCode(data)
    }
}