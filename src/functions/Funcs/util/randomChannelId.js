module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = d.client.channels.cache.random()?.id;
    if (!d.randoms.randomChannelId) {
        d.randoms.randomChannelId = result
    } else {
        result = d.randoms.randomChannelId;
    }

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}