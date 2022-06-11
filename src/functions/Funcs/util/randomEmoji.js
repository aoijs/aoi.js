module.exports = d => {
    let {code, result} = d.util.aoiFunc(d);

    result = d.client.emojis.cache.random()?.id;
    if (!d.randoms.randomEmoji) {
        d.randoms.randomEmoji = result
    } else {
        result = d.randoms.randomEmoji;
    }

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}