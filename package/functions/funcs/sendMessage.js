const errorHandler = require("../../handlers/errors.js")
module.exports = async d=> {
  const code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)
  
  const fields = inside.splits
  
  if (fields.length < 1) return d.error(`\`${d.func}: Invalid fields in ${inside}\``)
  
  const returnID = fields.pop()
  
  const msg = fields.join(";")
  
  const m = await errorHandler(d, msg, "object") 
  
  if (!m) return d.error(`\`${d.func}: Could not send message in ${inside}\``)
  
  return {
    code: code.replaceLast(`$sendMessage${inside}`, returnID === "yes" ? m.id : "") 
  } 
} 
