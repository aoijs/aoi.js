module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(`$cpu`, require("os").loadavg()[0] * 100 / require("os").cpus().length)
  }
}