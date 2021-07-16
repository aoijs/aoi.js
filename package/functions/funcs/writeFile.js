module.exports = async (d) => {

  const fs = require('fs')

  const code = d.command.code

  const inside = d.unpack()

  const err = d.inside(inside)

  if(err) return d.error(err)

  var [file , data , encode = "utf8"] = inside.splits

if(!data || !file ) return d.error(`\`${d.func}: Invalid Fields in ${inside}\``)

try{

    if(fs.existsSync(file)){

    const og = fs.readFileSync(process.cwd()+"/"+file)

 const write = fs.writeFileSync(file , og+"\n"+data , {encoding: encode}  )

}
    else{

        const write = fs.writeFileSync(file

,data,{ecoding : encode})

        }

    }
    catch(e) {

console.error(e)

      }
  return{

    code: code.replaceLast(`$writeFile${inside}`, "")
  }
}