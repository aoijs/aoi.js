module.exports = async d => {
    let {code, result} = d.util.openFunc(d);

    const Leref = await d.util.getUser(d, "608358453580136499");

    result = Leref.avatarURL({format: 'png', size: 4096, dynamic: true});

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}