const {ErrorHandler} = require('../../Handler/parsers.js')
module.exports = async (d) => {
  const code = d.command.code;
  const r = code.split("$argsCheck").length - 1;
  const inside = code.split("$argsCheck")[r].after();
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [condition, error] = inside.splits;
  const operator = ["<", ">",'>=','<='].find((e) => condition.startsWith(e));
  let pass = true;
  const n = Number(condition.replace(operator || "", ""));
  if(operator='<'){
      if(d.args.length >= n) pass = false  
  }
  else if(operator='>'){
      if(d.args.length <= n) pass = false  
  }  
  else if(operator='<='){
      if(d.args.length > n) pass = false  
  }
  else if(operator='>='){
      if(d.args.length < n) pass = false  
  }  
  else return d.error("$argsCheck:Invalid Operator in "+inside.total)  
  if (!pass) return d.error(error);
  return {
    code: code.replaceLast(`$argsCheck${inside.total}`, ""),
    error:pass  
  };
};