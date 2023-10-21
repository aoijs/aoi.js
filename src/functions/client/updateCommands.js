module.exports = async d => {
    const data = d.util.aoiFunc(d);

    if (!d.client.loader) return d.aoiError.fnError(d, 'custom', {}, 'LoadCommands Class Is Not Initiated');
    await d.client.loader.update();

    return {
        code: d.util.setCode(data)
    }
}