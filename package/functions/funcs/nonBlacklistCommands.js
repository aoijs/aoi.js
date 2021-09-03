module.exports = async d => {

    const {code} = d.command 

    const inside = d.unpack() 

    const err = d.inside(inside)

    if(err) d.error(err) 

    const [...ids] = inside.splits; 



    d.client.blacklist.commands.push(...ids) 

    return {

      code:code.replaceLast(`$nonBlacklistCommands${inside}`,"") 

        }

}