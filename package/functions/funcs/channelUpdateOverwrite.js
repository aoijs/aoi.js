module.exports = async (d) => {
    const code = d.command.code

    const inside = d.unpack()
    const err = d.inside(inside)

    if (err) return d.error(err)

    const [channel, target, sendmsg = null, embed = null, attach = null, reason = "", error] = inside.splits()

    const channel = d.message.guild.channels.cache.get(channel)

    const target = d.message.guild.roles.cache.get(target) || d.message.guild.members.cache.get(target)

    if (!channel || !target) return d.error(error)

    await channel.updateOverwrite(target, {
        SEND_MESSAGES: sendmsg,
        EMBED_LINKS: embed,
        ATTACH_FILES: attach
    }, reason)
    .catch((err) => null)

    return {
        code: code.replaceLast(
            `$channelUpdateOverwrite${inside}`,
            ""
        )
    }
}
