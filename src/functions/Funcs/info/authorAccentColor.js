module.exports = async d => {
    let {code, result, inside} = d.util.openFunc(d);

    const [def = '#ffffff'] = inside.splits;

    if (!d.author?.accentColor) {
        await d.author?.fetch()
    }

    result = d.author?.hexAccentColor ?? def;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}