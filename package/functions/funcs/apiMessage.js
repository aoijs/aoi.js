const axios = require('axios')
const ErrorParser = require('../../handlers/errorParser.js')
const ComponentParser = require('../../handlers/componentParser.js')
module.exports = async d => {
    const inside = d.unpack()
    const code = d.command.code
    const err = d.inside(inside)
    if (err) return d.error(err)
    const [channelId=d.channel.id,content, embed = "", components = "", msgReply = "", returnID = "no"] = inside.splits
    if (!content && embed === "") return d.error(`\`Provide Either A Content Or A Embed Structure\``)
    const e = embed !== "" ? await ErrorParser(embed) : {}

    const c = components === "" ? [] : await ComponentParser(components)

    const data = {
        content: content
        , embed: e
        , components: c
        , allowed_mentions: {
            parse: d.disabledMentions
        }
    }
    if (msgReply !== "") {
        let [Reply, mention = false] = msgReply.split(":")
        
        data.message_reference = {
            message_id: Reply
        }
        data.allowed_mentions.replied_user = mention.replace("yes", true)
            .replace("no", false)
    }
    let msg = await d.client.api.channels(channelId).messages.post({
        data 
    }).catch(() => null)

    return {
        code: code.replaceLast(`$apiMessage${inside}`, returnID === "no" ? "" : msg ? msg.id : "")
    }
}
