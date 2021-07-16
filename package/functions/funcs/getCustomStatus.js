
module.exports = async d => {
    const code = d.command.code

    const r = code.split("$getCustomStatus").length - 1

    const after = code.split("$getCustomStatus")[r].after()

    if (after.inside) {
        const [id, option = "state"] = after.splits 
        
        const user = await d.client.users.fetch(id).catch(err => { })

        if (!user) return d.error(`\`${d.func}: Invalid user ID in ${after}\``)

        const activity = user.presence.activities.find(c => c.name === "Custom Status")

        return {
            code: code.replaceLast(`$getCustomStatus${after}`, activity ? ((option === "state" ? activity.state : activity.emoji ? activity.emoji.toString() : "none") || "none"). removeBrackets() : "none")
        }
    } else {
        const activity = d.message.author.presence.activities.find(c => c.name === "Custom Status")

        return {
            code: code.replaceLast(`$getCustomStatus`, activity ? activity.state ? activity.state.removeBrackets() : "none" : "none")
        }
    }
}