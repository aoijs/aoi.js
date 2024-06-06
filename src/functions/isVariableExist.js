module.exports = (d) => {
        
  const data = d.util.aoiFunc(d);
  const [variable,table = d.client.db.tables[0]] = data.inside.splits;

  data.result = d.client.variableManager.has(variable,table)
    
  return {
    code: d.util.setCode(data)
  }
}