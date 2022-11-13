module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [messageID = d.message?.id, mentionUser = 'yes'] = data.inside.splits;

    d.allowedMentions.repliedUser = mentionUser === "yes";

    return {
        code: d.util.setCode(data),
        reply: {
            message: messageID,
            user: mentionUser === 'yes'
        },
        allowedMentions: d.allowedMentions
    }
}