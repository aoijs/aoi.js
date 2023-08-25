module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [threadId, reason, returnTags = false, ...threadTags] = data.inside.splits;

    const thread = await d.util.fetchChannel(d, threadId);
    const forum = await d.util.fetchChannel(d, thread.parentId);

    threadTags.map(tags => {
        const threadTag = tags.replace(/^[-+]/, '');

        const applyTags = forum.availableTags.find(tag => tag.name === threadTag || tag.id === threadTag);

        if (applyTags) {
            const appliedTags = thread.appliedTags;

            if (tags.startsWith('+') && !appliedTags.includes(applyTags.id)) {
                appliedTags.push(applyTags.id);
            } else if (tags.startsWith('-') && appliedTags.includes(applyTags.id)) {
                const index = appliedTags.indexOf(applyTags.id);
                appliedTags.splice(index, 1);
            }

            thread.setAppliedTags(appliedTags, reason);

            return applyTags.id;
        } else {
            return null;
        }
    }).filter(tag => tag !== null);

    data.result = returnTags === "true" ? thread.appliedTags : undefined;

    return {
        code: d.util.setCode(data),
    };
}
