
module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack() 
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [CODE, returnCode = "no",sendMessage="no",returnMessage="no",returnExec="no",returnId="no"] = inside.splits;
    d.message.message = d.message 
    const c = await d.interpreter(d.client,d.message,d.args,{name:"eval",code:CODE.addBrackets(),functions:d.client.functionManager.findFunctions(CODE.addBrackets())},d.client.db,returnCode === "yes", undefined,{}, undefined,returnMessage==="yes",returnExec==="yes",returnId==="yes",sendMessage==="yes")

  return {
    code: code.replaceLast(`$eval${inside}`, (returnCode ==="yes" && [returnMessage,returnExec,returnId].join(",")==="no,no,no"?c.code : require("util").inspect(c))|| ""),
  };
};
