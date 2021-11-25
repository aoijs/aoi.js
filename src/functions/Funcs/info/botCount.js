module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const [guildId = d.guild?.id] = inside.splits;

    const guild = await d.util.getGuild(d, guildId)
    const result = guild?.members.cache.filter(x => x.user.bot).size || 0

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}