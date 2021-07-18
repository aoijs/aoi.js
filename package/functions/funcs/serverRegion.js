const serverRegion = (d) => {
  return {
    code: d.command.code.replaceLast("$serverRegion", d.message.guild.region)
  }
}

module.exports = serverRegion