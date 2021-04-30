const Discord = require("discord.js")
const interpreter = require("../interpreter.js")
const ms = require("ms") 

const errorHandler = async (d, errorMessage, returnMsg = false, channel) => {

	const embed = new Discord.MessageEmbed()

	let send = true
	
	let deleteAfter
	
	let suppress = false 
	
	let reactions = []
	
	let edits = {
	    timeout: null, 
	    messages: [] 
	    
	}
	if (errorMessage.includes("{edit:")) {
	    const inside = errorMessage.split("{edit:")[1].split("}}")[0] 
	    
	    const duration = ms(inside.split(":")[0]) || 2500 
	    
	    for (const msg of inside.split(":{").slice(1).join(":{").split("}:{")) {
	        
	        const code = msg.split("}:{")[0] 
	    
	        edits.messages.push(code) 
	    } 
	    
	    edits.timeout = duration 
	    
	    errorMessage = errorMessage.replace(`{edit:${inside}}}`, "")
	}
	
	if (errorMessage.includes("{file:")) {
	    for (const after of errorMessage.split("{file:").slice(1)) {
	        const inside = after.split("}")[0] 
	        const fields = inside.split(":") 
	        const name = fields.pop().addBrackets() 
	        const text = fields.join(":").addBrackets()
	        embed.attachFiles(new Discord.MessageAttachment(Buffer.from(text), name))
	        errorMessage = errorMessage.replace(`{file:${inside}}`, "") 
	    }
	}
	if (errorMessage.includes("{suppress:")) {
	    const inside = errorMessage.split("{suppress:")[1].split("}")[0] 
	    
	    suppress = inside === "yes" 
	    
	    errorMessage = errorMessage.replace(`{suppress:${inside}}`, "")
	}
	
	if (errorMessage.includes("{attachment:")) {
	    for (const after of errorMessage.split("{attachment:").slice(1)) {
	        const inside = after.split("}")[0];let[name,...url]=inside.split(":");name=name.addBrackets();url=url.join(":").addBrackets();const attachment=new Discord.MessageAttachment(url, name);embed.attachFiles(attachment);errorMessage=errorMessage.replace(`{attachment:${inside}}`, "")
	    }
	}
	
	if (errorMessage.includes("{deletecommand")) {
	    const inside = errorMessage.split("{deletecommand")[1].split("}")[0] 
	    
	    if (d && d.message) {
	        if (inside) {
	            const dur = ms(inside.slice(1))
	            d.message.delete({
	                timeout: dur
	            }).catch(err => null)
	        } else d.message.delete().catch(err => null)
	    }
	    
	    errorMessage = errorMessage.replace(`{deletecommand${inside}}`, "")
	}
	if (errorMessage.includes("{delete:")) {
	    const duration = errorMessage.split("{delete:")[1].split("}")[0] 
	    deleteAfter = ms(duration || "1s") 
	    errorMessage = errorMessage.replace(`{delete:${duration}}`, "")
	}
	
	if (errorMessage.includes("{execute:")) {
		const command = errorMessage.split("{execute:")[1].split("}")[0]
		errorMessage = errorMessage.replace(`{execute:${command}}`, "")
		const cmd = d.client.awaited_commands.find(c => c.name === command)
		if (!cmd) return d.error(`:x: Invalid awaited command '${command}' in {execute:${command}}`)
		await d.interpreter(d.client, d.message, d.args, cmd)
	}

	if (errorMessage.includes("{title:")) {
		const inside = errorMessage.split("{title:")[1].split("}")[0]
		embed.setTitle(inside.addBrackets())
		errorMessage = errorMessage.replace(`{title:${inside}}`, "")
	}

	if (errorMessage.includes("{url:")) {
		const url = errorMessage.split("{url:")[1].split("}")[0]

		if (embed.title) embed.setURL(url.addBrackets())

		errorMessage = errorMessage.replace(`{url:${url}}`, "")
	}

	if (errorMessage.includes("{timestamp")) {
		const rest = errorMessage.includes("{timestamp:") ? errorMessage.split("{timestamp:")[1].split("}")[0] : ""

		embed.setTimestamp(Number(rest) || Date.now())

		errorMessage = errorMessage.replace(`{timestamp${rest ? ":" + rest : ""}}`, "")
	}

	if (errorMessage.includes("{author:")) {
		const inside = errorMessage.split("{author:")[1].split("}")[0].split(":")
		let to = inside.join(":")
		const text = inside.shift()
		const url = inside.join(":")
		embed.setAuthor(text.addBrackets(), typeof url === "string" ? url.addBrackets() : undefined)
		errorMessage = errorMessage.replace(`{author:${to}}`, "")
	}

	if (errorMessage.includes("{footer:")) {
		const inside = errorMessage.split("{footer:")[1].split("}")[0].split(":")
		let to = inside.join(":")
		const text = inside.shift()
		const url = inside.join(":")
		embed.setFooter(text.addBrackets(), typeof url === "string" ? url.addBrackets() : undefined)
		errorMessage = errorMessage.replace(`{footer:${to}}`, "")
	}

	if (errorMessage.includes("{description:")) {
		const inside = errorMessage.split("{description:")[1].split("}")[0]
		embed.setDescription(inside.addBrackets())
		errorMessage = errorMessage.replace(`{description:${inside}}`, "")
	}

	if (errorMessage.includes("{color:")) {
		const inside = errorMessage.split("{color:")[1].split("}")[0]
		embed.setColor(inside.addBrackets())
		errorMessage = errorMessage.replace(`{color:${inside}}`, "")
	}

	if (errorMessage.includes("{thumbnail:")) {
		const inside = errorMessage.split("{thumbnail:")[1].split("}")[0]
		embed.setThumbnail(inside.addBrackets())
		errorMessage = errorMessage.replace(`{thumbnail:${inside}}`, "")
	}

	if (errorMessage.includes("{field:")) {
		const fields = errorMessage.split("{field:")
		fields.shift()
		for (const after of fields) {
			const inside = after.split("}")[0].split(":")
			let inline = false
			let arg
			if (inside.length > 2 && ["yes", "no"].some(w => inside[inside.length - 1] === w)) {
				arg = inside.pop()
				inline = arg === "yes"
			}
			embed.addField(inside[0].addBrackets(), inside.slice(1).join(":").addBrackets(), inline)
			errorMessage = errorMessage.replace(`{field:${inside.join(":")}${arg ? `:${arg}` : ""}}`, "")
		}
	}

	if (errorMessage.includes("{image:")) {
		const inside = errorMessage.split("{image:")[1].split("}")[0]
		embed.setImage(inside.addBrackets())
		errorMessage = errorMessage.replace(`{image:${inside}}`, "")
	}

	if (errorMessage.includes("{reactions:")) {
		const inside = errorMessage.split("{reactions:")[1].split("}")[0]
		for (const reaction of inside.split(" ").join("").split(",")) {
			reactions.push(reaction.addBrackets())
		}
		errorMessage = errorMessage.replace(`{reactions:${inside}}`, "")
	}

	if (!(embed.length || embed.color || embed.thumbnail || embed.image || embed.author || embed.timestamp)) send = false
	
	if (send && suppress) send = false 
	
	if (returnMsg === true) {
		return {
			reactions: reactions.length ? reactions : undefined, 
			suppress, 
			embed: send ? embed : undefined,
			message: errorMessage.addBrackets()
		}
	}

	errorMessage = errorMessage.addBrackets().trim()

	if (!(errorMessage.length || send || embed.files.length)) return
	
	const ch = channel || d.channel 
	
	if ((errorMessage.length || send || embed.files.length) && d && ch) {
		const m = await ch.send(errorMessage.addBrackets(), send ? embed : embed.files.length? {
		    files: embed.files
		}: undefined).catch(Err => {
		})

		if (!m) return

		if (m && reactions.length) {
			for (const reaction of reactions) {
				await m.react(reaction).catch(err => { })
			}
		}
		
		if (m && edits.timeout) {
		    for (const code of edits.messages) {
		        await new Promise(e => setTimeout(e, edits.timeout)) 
		        
		        const sender = await errorHandler(d, code, true)
		        
		        await m.suppressEmbeds(suppress) 
		        await m.edit(sender.message, sender.embed).catch(err => null)
		        
		    }
		}
		
		if (m && deleteAfter) {
		    m.delete({
		        timeout: deleteAfter
		    }).catch(err => null)
		}
		
		if (returnMsg === "id") {
			return m.id
		} else if (returnMsg === "object") {
			return m
		} else if (returnMsg === "withMessage") return m 
	}
}

module.exports = errorHandler