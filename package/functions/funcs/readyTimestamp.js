module.exports = d => {
  return {
    code: d.command.code.replaceLast("$readyTimestamp", d.client.readyTimestamp)
  }
}
