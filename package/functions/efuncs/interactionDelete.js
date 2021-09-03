module.exports = async d => {
const code = d.command.code
const inside = d.unpack()
d.data.interaction?.deleteReply() 
return { 
code: code.replaceLast(`$interactionDelete`,"")
}
}
