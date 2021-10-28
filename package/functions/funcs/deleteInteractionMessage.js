module.exports = async d => {
const code = d.command.code
const inside = d.unpack()
d.data.interaction.message.delete()
return { 
code: code.replaceLast(`$deleteInteractionMessage`,"")
}
}
