module.exports = async (d) => {
const inside = d.unpack()
	const err = d.inside(inside)
		if (err) return d.error(err)
    let [type] = inside.splits
let data = await d.client.db.all("main")
     if(!["vars","data"].includes(type)) return d.error(`:x: Invalid Type Provided In $variablesCount${inside}`)
   return {
    code: d.command.code.replaceLast(
      `$variablesCount${inside}`, type == "data" ?data.length : Object.keys(d.client.variables).length 
   )
  };
}
