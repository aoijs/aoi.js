const Interpreter = require("../../interpreter.js")
const CustomCollector = require("../customHandler/collector.js")


module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    
    let [messageID, filter, time, customIDs, cmds, errorMsg = "", endcommand = ""] = inside.splits
    time = require('ms')(time)
    
    if (!time) return d.error("\`Invalid Time provided\`")

    cmds = cmds.split(",")
    cmds.forEach(x => {
        if (d.client.awaited_commands.find(y => y.name === x)) {} else {
            d.error("\`Could not find awaitedCommand\`" + x)
        }
    })
    customIDs = customIDs.split(",")

    const button = new CustomCollector(messageID, filter, time, customIDs, cmds, errorMsg.split(","), d.client)
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
                , member: data.member
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
                    
                }
                , []
                , endcmd
                , undefined
                , undefined
                , undefined, {
                    interaction: data
                }
            )
        })
    }
    return {
        code: code.replaceLast(`$buttonCollector${inside}`, "")
    }
    
}
