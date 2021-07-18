module.exports = async d => {
    const code = d.command.code

    const r = code.split("$isBoosting").length - 1

    const after = code.split("$isBoosting")[r].after()

    if (after.inside) {
        const inside = after.inside

        const member = await d.message.guild.members.fetch(inside).catch(err => {})

        if (!member) return d.error(`\`${d.func}: Invalid user ID in ${after}\``)

        return {
            code: code.replaceLast(`$isBoosting${after}`, member.premiumSince !== null)
        }
    } else {
        return {
            code: code.replaceLast(`$isBoosting`, d.message.member.premiumSince !== null)
        }
    }
}