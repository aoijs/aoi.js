module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const sep = inside.inside

        return {
            code: code.replaceLast(`$serverIDs${inside}`, d.client.guilds.cache.map(g => g.id).join(sep))
        }
    } else {
        return {
            code: code.replaceLast(`$serverIDs`, d.client.guilds.cache.map(g => g.id).join(", "))
        }
    }
}