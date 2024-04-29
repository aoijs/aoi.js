module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.data.interaction?.isStringSelectMenu() || d.data.interaction?.isUserSelectMenu() || d.data.interaction?.isRoleSelectMenu() || d.data.interaction?.isChannelSelectMenu() || d.data.interaction?.isMentionableSelectMenu();

    return {
        code: d.util.setCode(data)
    }
}