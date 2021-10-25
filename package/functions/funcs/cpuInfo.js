const os = require("os")

let u16
let u8

module.exports = async (d) => {
  const { code } = d.command
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)

  const option = inside.inside.toLowerCase()

  let data

  switch (option) {
    case "usage":
      data = os.loadavg()[0] * 100 / os.cpus().length
      break
    case "model":
      data = os.cpus()[0].model
      break
    case "clock":
      const { speed } = os.cpus()[0]
      data = speed > 1000 ? `${(speed / 1000).toFixed(1)} GHz` : `${speed} MHz`
      break
    case "arch":
      data = os.arch()
      break
    case "endian":
      if (!u16) {
        u16 = new Uint16Array([0xbbdd])
        u8 = new Uint8Array(u16.buffer, u16.byteOffset, u16.byteLength)
      }

      data = u8[0] === 0xdd && u8[1] === 0xbb ? "LE" : "BE"
      break
    default:
      return d.error(`\`$${d.func}: Invalid option '${option}' in ${inside}\``)
  }

  return {
    code: code.replaceLast(`$cpuInfo${inside}`, data)
  }
}
