module.exports = async d => {
    const code = d.command.code 
    const inside = d.unpack()
    let [type="defer",ephemeral=false] = inside.splits
    d.data.interaction[type==="defer"?"defer":"deferUpdate"]({ephemeral: ephemeral})
    return {
        code: code.replaceLast(`$interactionDefer${inside}`, "")
    }
}