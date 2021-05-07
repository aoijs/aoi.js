module.exports = async d => {
    const code = d.command.code;

    const inside = d.unpack();
    const err = d.inside(inside);

    if (err) return d.error(err);

    const guild = await d.message.guild.edit({
        systemChannel: inside.addBrackets()
    }).catch(err => {})

    if (!guild) return d.error(`:x: Failed to set System Channel!`)

    return {
        code: code.replaceLast(`$setSystemChannel${inside}`, "")
    }
}