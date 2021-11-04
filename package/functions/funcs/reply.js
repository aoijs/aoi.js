module.exports = d => {
    const data = d.util.openFunc(d);

    const [messageId = d.message?.id, mentionUser = 'yes'] = data.inside.splits;

    d.allowedMentions.repliedUser = mentionUser === "yes";

    return {
        code: d.util.setCode(data),
        reply: {
            message: messageId,
            user: mentionUser === 'yes'
        },
        allowedMentions: d.allowedMentions
    }
}