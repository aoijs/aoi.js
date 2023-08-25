module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [forumId, option = "id", separator = " , "] = data.inside.splits;

    const forum = await d.util.fetchChannel(d, forumId);

    data.result = forum.availableTags.map(tag => tag[option]).join(separator);

    return {
        code: d.util.setCode(data)
    };
}
