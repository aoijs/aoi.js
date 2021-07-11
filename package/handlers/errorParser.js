const ErrorParser = (msg) => {
    const checker = (thingy) => msg.includes("{" + thingy + ":");
    const embed = {}
    //---------------------------------------//
    if (checker("title")) {
        embed.title = msg.split("{title:")[1].split("}")[0]
    }
    //---------------------------------------//
    if (checker("description")) {
        embed.description = msg.split("{description:")[1].split("}")[0]
    }
    //---------------------------------------//
    if (checker("footer")) {
        const footer = msg.split("{footer:")[1].split("}")[0]
        const fields = footer.split(":")
        const footerText = fields.shift()
        const footerURL = fields.join(":")
        embed.footer = {
            text: footerText
            , icon_url: footerURL
        }
    }
    //---------------------------------------//
    if (checker("author")) {
        const author = msg.split("{author:")[1].split("}")[0]
        const fields = author.split(":")
        const authorName = fields.shift()
        const authorURL = fields.pop()
        const authorIcon = fields.join(":")
        embed.author = {
            name: authorName.replace(/#COLON#/g, ":")
            , icon_url: authorIcon
            , url: authorURL.replace(/#COLON#/g, ":")
        }
    }
    //---------------------------------------//
    if (checker("image")) {
        embed.image = {
            url: msg.split("{image:")[1].split("}")[0]
        }
    }
    //---------------------------------------//
    if (checker("url")) {
        embed.url = msg.split("{url:")[1].split("}")[0]
    }
    //---------------------------------------//
    if (checker("color")) {
        embed.color = Number(parseInt(msg.split("{color:")[1].split("}")[0].replace("#", ""), 16)
            .toString(10))
    }
    //---------------------------------------//
    if (checker("thumbnail")) {
        embed.thumbnail = {
            url: msg.split("{thumbnail:")[1].split("}")[0]
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
            const name = field.shift()
            const inline = field.pop()
            const value = field.join(":")
            
            
            res.push({
                name: name.replace(/#COLON#/g, ":")
                , value: value.replace(/#COLON#/g, ":")
                , incline: inline.replace("yes", true)
                    .replace("no", false)
            })
        })
        embed.fields = res
    }
    
    
    //---------------------------------------//
    
    
    return embed
}
module.exports = ErrorParser;
