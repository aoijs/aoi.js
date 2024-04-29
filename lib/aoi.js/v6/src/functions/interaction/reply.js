module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [messageID = d.message?.id, mentionUser = 'true'] = data.inside.splits;

    d.allowedMentions.repliedUser = mentionUser === "true";

    return {
        code: d.util.setCode(data),
        reply: {
            message: messageID,
            user: mentionUser === 'true'
        },
        allowedMentions: d.allowedMentions
    }
}