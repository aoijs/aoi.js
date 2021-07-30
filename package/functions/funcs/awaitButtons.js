const Interpreter = require("../../interpreter.js")
const Await = require("../customHandler/await.js")
const ErrorParser = require('../../handlers/errorParser.js')

module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    //----------------------------------------//
    let [messageID, filter, customIDs, cmds, errorMsg = "", uses = 1] = inside.splits
    if(errorMsg === "" || !errorMsg) errorMsg = [] 
    else {
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
    //---------------------------------------//
    // console.log("messageid:"+messageID)
    const button = new Await(messageID, filter, customIDs, cmds, errorMsg, uses, d.client)
    
    //---------------------------------------//
    d.client.applications.events.on("ButtonClick", async data => {
        
        button.await(data.message.id, data.author.id, data.button.customID, data)
    })
    button.on("AwaitButton", async data => {
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
    
    return {
        code: code.replaceLast(`$awaitButtons${inside}`, "")
    }
    
}
