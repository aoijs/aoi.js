module.exports = d => {
  return {
    code: d.command.code.replaceLast("$ping", d.client.ws.ping)
  }
} 