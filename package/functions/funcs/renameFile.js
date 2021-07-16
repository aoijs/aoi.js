module.exports = async d => {

    const fs = require('fs')

    let code = d.command.code 

    const inside = d.unpack() 

    const err = d.inside(inside) 

    if(err) return d.error(err)

    let [oldfile,newfile] = inside.splits

   if(fs.existsSync(oldfile) && !fs.existsSync(newfile)){

    fs.renameSync(oldfile,newfile) 

       } else {

    if(!fs.existsSync(oldfile)) return d.error(`\`Couldn't Found the ${oldfile} file\``)
    if(fs.existsSync(newfile)) return d.error(`\`File with name \`${newfile}\` already exist\``)

   }
    return{

    code: code.replaceLast(`$renameFile${inside}`,"")

  }
    }
