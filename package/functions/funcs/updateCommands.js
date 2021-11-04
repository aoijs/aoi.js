module.exports = d => {
    const { code } = d.util.openFunc(d);

    if (!d.client.loader) return d.aoiError.fnError(d, 'custom', {}, 'LoadCommands Class Is Not Initiated');
    d.client.loader.update();

    return {
        code: d.util.setCode({ function: d.func, code })
    }
}