module.exports = (d) => {
   const start = Date.now() 

d.client.db.all("main")
  return {
    code: d.command.code.replaceLast("$dbPing", 
    `${Date.now() - start}`),
  };
};
