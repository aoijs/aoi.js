module.exports = async (d) => {
   const start = Date.now() 

   await d.client.db.all("main")
   
   return {
      code: d.command.code.replaceLast("$dbPing", 
      `${Date.now() - start}`),
   };
};
