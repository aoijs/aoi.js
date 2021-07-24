module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$shardCount`, d.client.shard.count)
    }
}
