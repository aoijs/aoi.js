module.exports = async (d) => {

    let e = JSON.stringify(d.client.variables).split(",").join("\n").split("}")
    let u = e.splice(e.length,1)
    
    return {
      code: d.command.code.replaceLast(`$clientVariables`, e.join("").replace("{","")),
    };
  };
