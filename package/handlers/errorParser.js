const Discord = require('discord.js')
const {mustEscape} = require('../utils/mustEscape.js')
const ErrorParser =async (msg) => {
msg = await mustEscape (msg)
    const checker = (thingy) => msg.includes("{" + thingy + ":");
    const embed = {}
    //---------------------------------------//
    if (checker("title")) {
        embed.title = (msg.split("{title:")[1].split("}")[0]).addBrackets()
    }
    //---------------------------------------//
    if (checker("description")) {
        embed.description = (msg.split("{description:")[1].split("}")[0]).addBrackets()
    }
    //---------------------------------------//
    if (checker("footer")) {
        const footer = msg.split("{footer:")[1].split("}")[0]
        const fields = footer.split(":")
        const footerText = (fields.shift()).addBrackets()
        const footerURL = fields.join(":").addBrackets()
        embed.footer = {
            text: footerText
            , icon_url: footerURL
        }
    }
    //---------------------------------------//
    if (checker("author")) {
        const author = msg.split("{author:")[1].split("}")[0]
        const fields = author.split(":")
        const authorName = fields.shift().addBrackets()
        const authorURL = fields.pop().addBrackets()
        const authorIcon = fields.join(":").addBrackets()
        embed.author = {
            name: authorName
            , icon_url: authorIcon
            , url: authorURL
        }
    }
    //---------------------------------------//
    if (checker("image")) {
        embed.image = {
            url: msg.split("{image:")[1].split("}")[0].addBrackets()
        }
    }
    //---------------------------------------//
    if (checker("url")) {
        embed.url = msg.split("{url:")[1].split("}")[0].addBrackets()
    }
    //---------------------------------------//
    if (checker("color")) {
        embed.color =await Discord.resolveColor(msg.split("{color:")[1].split("}")[0])
    }
    //---------------------------------------//
    if (checker("thumbnail")) {
        embed.thumbnail = {
            url: msg.split("{thumbnail:")[1].split("}")[0].addBrackets()
        }
    }
    //---------------------------------------//
    if (msg.includes("{timestamp")) {
        let timestamp = msg.split("{timestamp")[1].split("}")[0].replace(":", "")
        
        if (timestamp === "" || timestamp === "ms") {
            timestamp = Date.now()
        }
        embed.timestamp = new Date(Number(timestamp))
    }
    //---------------------------------------//
    if (checker("field")) {
        const fields = msg.split("{field:")
            .slice(1)
        const res = []
        fields.forEach(x => {
            const y = x.split("}")[0]
            const field = y.split(":")
            const name = field.shift().addBrackets()
            const inline = field.pop().addBrackets()
            const value = field.join(":").addBrackets()
            
            
            res.push({
                name: name
                , value: value
                , inline: inline.replace("yes", true)
                    .replace("no", false)
            })
        })
        embed.fields = res
    }
    
    
    //---------------------------------------//
    
    
    return embed
}
module.exports = ErrorParser;
