
module.exports = async d => {
const {code} = d.command 
const inside = d.unpack() 
const err = d.inside(inside) 
if(err) return d.error(err) 
    let [condition,errorMessage=""] = inside.splits; 
    errorMessage = await d.util.errorParser(errorMessage) 
   const checker = {
      a:d.args.length < Number(condition.replace("<","")),
      b:d.args.length > Number(condition.replace(">","")),
      c:d.args.length <= Number(condition.replace("<=","")),
       d:d.args.length >= Number(condition.replace(">=","")),
       e:d.args.length === Number(condition),
   }
  const check = condition.startsWith("<=") ? checker.c : condition.startsWith(">=") ? checker.d : condition.startsWith("<") ? checker.a : condition.startsWith(">") ? checker.b : checker.e 
   if(!checker && errorMessage !== ""){
       d.channel.send(errorMessage) 
                }
    return {
        code:d.util.setCode({function:d.func,code,inside}),
        error:checker 
    }
}