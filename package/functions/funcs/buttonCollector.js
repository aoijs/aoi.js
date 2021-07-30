const Interpreter = require("../../interpreter.js")
const CustomCollector = require("../customHandler/collector.js")
const ErrorParser = require('../../handlers/errorParser.js')

module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    
    let [messageID, filter, time, customIDs, cmds, errorMsg = "", endcommand = ""] = inside.splits
    time = require('ms')(time)
    
    if (!time) return d.error("\`Invalid Time provided\`")
    if(errorMsg === "" || !errorMsg) errorMsg = [] 
    else{
    errorMsg = errorMsg.split(",")
        errorMsg[1] = errorMsg[1] === "" ? [] : await ErrorParser(errorMsg[1]||"")
        errorMsg[2] = errorMsg[2]||0
    }
    cmds = cmds.split(",")
    cmds.forEach(x => {
        if (d.client.awaited_commands.find(y => y.name === x)) {} else {
            d.error("\`Could not find awaitedCommand\`" + x)
        }
    })
    customIDs = customIDs.split(",")

    const button = new CustomCollector(messageID, filter, time, customIDs, cmds, errorMsg, d.client)
    const endcmd = d.client.awaited_commands.find(x => x.name === endcommand);

    d.client.applications.events.on("ButtonClick", async data => {
        
        button.start(data.message.id, data.author.id, data.button.customID, data)
    })
    button.on("ItemFound", async data => {
        const cmd = d.client.awaited_commands.find(x => x.name === cmds[customIDs.indexOf(data.button.customID)])
        
        if (!cmd) return;
        await Interpreter(d.client, {
                author: data.author
                , message: data.message
                , channel: data.channel
                , guild: data.guild
                , member: data.member,
            client:d.client 
            }
            , []
            , cmd
            , undefined
            , undefined
            , undefined, {
                interaction: data
            }
        )
    })
    if (endcommand !== "") {
        button.once("CustomCollectorOff", async data => {
            await Interpreter(d.client, {
                    message: data[0].message ,
                    channel:data[0].channel,
                    guild:data[0].guild,
                    author:data[0]. author,
                    member:data[0].member ,
                client:d.client 
                }
                , []
                , endcmd
                , undefined
                , undefined
                , undefined, {
                    interaction: data[0],
                    mainData: data 
                }
            )
        })
    }
    return {
        code: code.replaceLast(`$buttonCollector${inside}`, "")
    }
    
}
