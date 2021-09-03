module.exports = d => {
  return {
    code: d.command.code.replaceLast(`$serverCount`,d.client.guilds.cache.size)
  } 
} 