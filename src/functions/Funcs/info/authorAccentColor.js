module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [def = '#ffffff'] = data.inside.splits;

    if (!d.author?.accentColor) {
        await d.author?.fetch()
    }

    data.result = d.author?.hexAccentColor ?? def
    return {
        code: d.util.setCode(data)
    }
}