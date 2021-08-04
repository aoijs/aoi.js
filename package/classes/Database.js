const aoiDb = require('dbdjs.db')
class Database extends aoiDb.Database{
    constructor(options={path:"./database/",tables:["main"]}){
        let table = []
        for(const name of options.tables){
          table.push({name:name})
      }
      
        super({
  path: options.path,
  tables:table,
  maxFileData:10000,
  cacheMaxSize:10000,
  saveTime:3,
  getTime: 1,
  allTime:2,
  deleteTime:4});
  this.options = options 
}
}
class Promisify {
    constructor(DbClass){
 
const props = Object.getOwnPropertyNames(DbClass)
        this.db = DbClass 
        this.methods = props 
        this.tables = {}
    }
 async createTable(tables){
      for(const table of tables){
      let filters = this.methods.filter(x=> x?.toLowerCase().includes("table"))
       if(filters.length ===1){
           filters = filters.find(x=>x)

this.tables[table] = new this.db[filters](table)

       }
  else if(filters.length >1){
      filters = filters.find(x=>x.includes("create")) 
      if(!filters) return console.error("Db Is Not Supported.Open a Issue with Feature Request about this")
     return this.tables[table] = new this.db[filters](table) 
  }
}
      }
  deleteTable(table){
    return  delete this.tables[table]
  }
    get(table, variable,value){
    let filters = this.methods.find(x=>x.toLowerCase() === "get" || x.toLowerCase() === "fetch" || x.toLowerCase() === "find")
    if(!this.tables[table]) return console.error(`No Table Found With Name ${table}`) 
       return this.tables[table][filters](variable)
    }
   set(table,variable,value){
       let filters = this.methods.find(x=>x.toLowerCase() === "set") 
      if(!filters) return console.error("Db Not Supported.Open a Issue with Feature Request about this")
     if(!this.tables[table]) return console.error(`Table With Name ${table} doesn't exist`) 
      return this.tables[table][filters](variable,value) 
   }
 async all(table,func =( x=>x ===x)){
     let filters = this.methods.find(x=>x.toLowerCase() === "all" || x.toLowerCase() === "findall" || x.toLowerCase() === "fetchall")
     if(!filters) return console.error("Db Not Supported.Open a Issue with Feature Request about this")
  if(!this.tables[table]) return console.error(`Table With Name ${table} doesn't exist`)      
   const all = await this.tables[table][filters]({})
return all.filter(func)   
 }
}
module.exports = {
    Database: Database,
    Promisify : Promisify 
    }