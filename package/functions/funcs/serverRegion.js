const serverRegion = (d) => {
              
  return {
    code: d.command.code.replaceLast("$serverRegion", d.message.guild.region)
  }
  //leref code :3
}

module.exports = serverRegion