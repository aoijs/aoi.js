const Discord = require("discord.js")
module.exports = async (d) => {
    let code = d.command.code
    let vars = d.vars

    let r = code.split("$let").length - 1

    let inside = code.split("$let")[r].after()

    const err = d.inside(inside);

    if (err) return d.error(err);

    let [letname, value] = inside.splits

    vars[letname] = value;

    code = code.replaceLast(`$let${inside}`, "")
    
    return {
        code: code
    }
  }