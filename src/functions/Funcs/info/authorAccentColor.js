module.exports = async d => {
    let data = d.util.aoiFunc(d);

    const [def = 'default'] = data.inside.splits;

    if (!d.author?.accentColor) {
        await d.author?.fetch({force: true})
    }

    data.result = d.author?.hexAccentColor ?? def;

    return {
        code: d.util.setCode(data)
    }
}