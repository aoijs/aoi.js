const permissions = require("../../utils/permissions")
const permissionsBitField = require("../../utils/permissionsBitField")

module.exports = async d => {
    const code = d.command.code 
    const r = code.split("$getBotInvite").length - 1
    const inside = code.split("$getBotInvite")[r].after()

    let perms = inside.splits || []
    let done = []
    let error = false
    let total = 0
    let i = 0
    const keysBit = Object.keys(permissionsBitField)
    const keys = Object.keys(permissions)
    
    loop:
    while (i < perms.length) {
      const x = permissions[perms[i]]
      const y = permissionsBitField[x]

      if (!x) {
        error = ":x: Invalid Permission of `" + perms[i] + "` in `$getBotInvite" + inside.total + "`";
        break loop;
      }
      if (done.includes(y)) {
        error = ":x: Duplicated Permission of `" + perms[i] + "` in `$getBotInvite" + inside.total + "`";
        break loop;
      }
      done.push(y)
      
      total += parseInt(y)
      i++
    }

    if (error) {
      return d.error(error)
    }


    return {
        code: d.command.code.replaceLast(`$getBotInvite${inside.total}`, `https://discord.com/oauth2/authorize?client_id=${d.client.user.id}&scope=bot+applications.commands&permissions=${total}`)
    }
}