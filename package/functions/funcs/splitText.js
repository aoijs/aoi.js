module.exports = d => {
  const code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)
  
  const n =Number(inside.inside)
  
  if (isNaN(n) || n < 1) return d.error(`\`${d.func}: Invalid number in ${inside}\``)
  
  return {
    code: code.replaceLast(`$splitText${inside}`, d.array[n - 1] ? d.array[n - 1].removeBrackets() : "") 
  } 
}