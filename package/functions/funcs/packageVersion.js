module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$packageVersion`, require("../../../package.json").version)
    }
}