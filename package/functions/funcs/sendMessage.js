const errorHandler = require("../../handlers/errors.js")

module.exports = async d=> {
 
  const code = d.command.code
  
  const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
  
  const fields = inside.splits
  
  if (fields.length < 1) return d.error(`❌ Invalid fields in \`$sendMessage${inside}\``)
  
  const returnID = fields.pop()
  
  const msg = fields.join(";")
  
  const m = await errorHandler(d, msg, "object") 
  
  if (!m) return d.error(`:x: Could not send message in \`$sendMessage${inside}\``)
  
  return {
    code: code.replaceLast(`$sendMessage${inside}`, returnID === "yes" ? m.id : "") 
  } 
} 
