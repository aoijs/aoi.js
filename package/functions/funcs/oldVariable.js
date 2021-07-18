module.exports = async d =>{

    let code = d.command.code

    const inside = d.unpack()

    const err = d.inside(inside)
    if(err) return d.error(err)

    let [opt,seperator = " , "] = inside.splits
    if(!["variable","key","value","guild","for","type","timestamp"].includes(opt)) return d.error(`\`${d.func}: Invalid Option in ${inside}\``)
   return {
       code: code.replaceLast(`$oldVariable${inside}`, typeof d.data.oldv[opt] != "object" ? d.data.oldv[opt] : d.data.oldv[opt].join(seperator) || "")
       }
}
