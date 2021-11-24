module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    let [size = 4096, dynamic = "yes", format = "webp"] = inside.splits;
    return {
        code: d.util.setCode({
            function: d.func,
            code,
            inside,
            result: d.author?.displayAvatarURL({size: Number(size), dynamic: dynamic === 'yes', format})
        })
    }
}