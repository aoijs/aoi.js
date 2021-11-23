module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = d.client.guilds.cache.random()?.id;
    if (!d.randoms.randomGuild) {
        d.randoms.randomGuild = result
    } else {
        result = d.randoms.randomGuild;
    }

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}