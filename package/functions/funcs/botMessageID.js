module.exports =async d => {
const code = d.command.code
const inside = d.unpack()
return {
code: code.replaceLast("$botMessageID",""),
returnID: true 
}
}