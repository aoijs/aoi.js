module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [forumId, name, content, autoArchiveDuration = "10080", returnId = false, reason, ...appliedTags] = data.inside.splits;

    const forum = await d.util.fetchChannel(d, forumId);

    const parseTags = appliedTags.map(tag => {
        const tags = forum.availableTags.find(t => t.name === tag || t.id === tag);
        return tags ? tags.id : null;
    }).filter(tag => tag !== null);

    content = await d.util.errorParser(content, d);

    const thread = await forum.threads.create({
        name,
        autoArchiveDuration,
        message: content.data ? content.data : content,
        appliedTags: parseTags,
        reason
    });

    data.result = returnId === "true" ? thread.id : undefined;

    return {
        code: d.util.setCode(data)
    };
}