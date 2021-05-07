module.exports = async d => {
    const code = d.command.code;

    const inside = d.unpack();
    const err = d.inside(inside);

    if (err) return d.error(err);

    const opts = {
        "0": "DISABLED",
        "1": "MEMBERS_WITHOUT_ROLES",
        "2": "ALL_MEMBERS"
    }

    const guild = await d.message.guild.edit({
        explicitContentFilter: opts[inside.addBrackets()]
    }).catch(err => {})

    if (!guild) return d.error(`:x: Failed to set Verification Level!`)

    return {
        code: code.replaceLast(`$setExplicitFilter${inside}`, "")
    }
}