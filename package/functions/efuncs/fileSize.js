const fs = require('fs')

module.exports = async (d) => {

 //ayaka was here

  const code = d.command.code

  const inside = d.unpack()

	const err = d.inside(inside)

	if (err) return d.error(err)

 const [file , size] = inside.splits

let options = ["b","kb","mb","gb"]

 

 if(size=== undefined) return d.error(`No option given in $filesize${inside}`)
let result;
try{

 const stats = await fs.promises.stat(file)

   switch (size.toLowerCase()){

           case "b":

       result = stats.size

           break;

           case "kb":

           result = stats.size/1024

           break;

           case "mb":

           result = stats.size/1024/1024

           break;

           case "gb":

           result = stats.size/1024/1024/1024

           break;

           default :

          result = d.error(`❌ invalid size in $filesize${inside}`)

           ;

}

}

    catch(e) {

        d.error(`no file like ${file} exist`)}

    

   

  

  return{

    code: code.replaceLast(`$fileSize${inside}`, result)

  } 

}   
