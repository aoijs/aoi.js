module.exports = async d => {
    const code = d.command.code;

    const inside = d.unpack();
    const err = d.inside(inside);

    if (err) return d.error(err);

    const opts = {
        "0": "NONE",
        "1": "LOW",
        "2": "MEDIUM",
        "3": "HIGH",
        "4": "VERY_HIGH"
    }

    const guild = await d.message.guild.edit({
        verificationLevel: opts[inside.addBrackets()]
    }).catch(err => {})

    if (!guild) return d.error(`:x: Failed to set Verification Level!`)

    return {
        code: code.replaceLast(`$setVerifyLevel${inside}`, "")
    }
}