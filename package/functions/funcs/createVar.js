module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [...variables] = inside.splits;

  for (let variable of variables) {
    variable = variable.addBrackets();

    const [varName, ...varValue] = variable.split(":");

    d.client.variables[varName] = varValue.join(":");
  }
let data = {} 
for(let i = 0;variables.length > i;i++){
    data[variables[i].split(":")[0]] = variables [i].split(":")[1] 
    }
    d.client.emit("VARIABLE_CREATE",d.client,d.client.db,variables,Object.keys(data),Object.values(data),[Date.now()])
  return {
    code: code.replaceLast(`$createVar${inside}`, ""),
  };
};
