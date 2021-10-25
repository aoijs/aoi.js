module.exports = async d => {
  const { code } = d.command
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)

  const option = inside.inside.toLowerCase()
  const memUsage = process.memoryUsage()

  let data

  switch (option) {
    case "os":
      data = BToMB(memUsage.rss)
      break
    case "jsalloc":
      data = BToMB(memUsage.heapTotal)
      break
    case "jsused":
      data = BToMB(memUsage.heapUsed)
      break
    case "c++":
      data = BToMB(memUsage.external)
      break
    case "buffer":
      data = BToMB(memUsage.arrayBuffers)
      break
    default:
      return d.error(`\`$${d.func}: Invalid option '${option}' in ${inside}\``)
  }

  return {
    code: code.replaceLast(`$${d.func}${inside}`, data)
  }
}

function BToMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2)
}
