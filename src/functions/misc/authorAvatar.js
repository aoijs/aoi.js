/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [size = 4096, dynamic = "true", extension = "webp"] = data.inside.splits;

    data.result = d.author?.displayAvatarURL({size: Number(size), forceStatic: dynamic === 'false', extension})
    return {
        code: d.util.setCode(data)
    }
}
