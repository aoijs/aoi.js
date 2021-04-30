module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$getTextSplitLength`, d.array.length)
    }
}