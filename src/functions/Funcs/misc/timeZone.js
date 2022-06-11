module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [timezone = d.timezone] = data.inside.splits;

    try {
        new Date().toLocaleString('en-us', {
            timeZone: timezone.addBrackets(),
        });
    } catch (err) {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid TimeZone Provided In');
    }

    return {
        code: d.util.setCode(data),
        timezone: timezone.addBrackets(),
    }
}