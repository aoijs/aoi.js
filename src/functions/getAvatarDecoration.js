/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [userId = d.author?.id, extension = "png", size = "4096" ] = data.inside.splits;

    const user = await d.util.getUser(d, userId);

    data.result = user.avatarDecorationURL({
        extension,
        size: Number(size)
    })

    return {
        code: d.util.setCode(data)
    }
}