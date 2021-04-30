module.exports = d => {
 
  let code = d.command.code
  
  return {
    code: code.replaceLast(`$mention`, `${d.message.author}`)
  } 
} 