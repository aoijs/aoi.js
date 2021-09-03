const interpreter = require("../../interpreter.js")
const {wait} = require("../../Utils/helpers/functions.js")
//const db = require("quick.db")
const loop = async d => {

    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    let [times,wait=0,data="",...commands] = inside.splits; 
 try {
     data = JSON.parse(data)
 }
    catch(e){
        d.error(e)
    }
    for (let i = 0;i < times;i++) {
        for (const command of commands) {
            const cmd = d.client.cmd.awaited.find(c => c.name === command)

            if (!cmd) return d.error(`:x: Invalid awaited command '${command}' in \`$loop${inside}\``)

            await interpreter(d.client, d.message, d.args, cmd, undefined, false, undefined,data)
        }
    }

    return {
        code: code.replaceLast(`$loop${inside}`, "")
    }
}

module.exports = loop