module.exports = async d => {
const code = d.command.code
const inside = d.unpack()
d.data.interaction.deleteResponse() 
return { 
code: code.replaceLast(`$interactionDelete`,"")
}
}
