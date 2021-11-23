module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = d.client.users.cache.random()?.id;
    if (!d.randoms.randomUserId) {
        d.randoms.randomUserId = result
    } else {
        result = d.randoms.randomUserId;
    }

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}