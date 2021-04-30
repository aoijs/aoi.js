module.exports = (d) => {
   const start = Date.now() 

d.client.db.set("main", Date.now())
  return {
    code: d.command.code.replaceLast("$dbPing", 
    `${Date.now() - start}`),
  };
};
