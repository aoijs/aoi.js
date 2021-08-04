module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$packageName`, require("../../../package.json").name)
    }
}