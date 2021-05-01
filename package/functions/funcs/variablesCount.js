module.exports = async (d) => {

const inside = d.unpack()

	const err = d.inside(inside)

		if (err) return d.error(err)

    

let res;

    let [type] = inside.splits

if(type == "data"){

res = await d.client.db.all("main") 

res = res.length

}

else if(type =="vars"){

res = Object.keys(d.client.variables).length

}

else {

d.error(`Invalid Type Provided In $variablesCount${inside}`)

}

  return {

    code: d.command.code.replaceLast(

      `$variablesCount${inside}`,

   res)

  };

}

    
