module.exports = async d => {
    let data = d.util.aoiFunc(d);

    const Leref = await d.util.getUser(d, "608358453580136499");

    data.result = Leref.avatarURL({format: 'png', size: 4096, dynamic: true});
    return {
        code: d.util.setCode(data)
    }
}