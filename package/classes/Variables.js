const Group = require('../CacheHandler/index.js').cache 
class Variable {
    constructor(data={}){
        this.name = data.name 
        this.type = data.type 
        this.default = data.value 

    }
    setType(type){
        if(this.types.includes(type)) this.type = type 
        else return console.error("VariableTypeError: Invalid Type : "+type) 
    }
 object(){
     let x ={}
      Object.assign(x,this) 
     return x 
 }
}
class VariableManager {
    constructor(client){
        this.client = client 
        this.cache = new Group() 
    }
    findType(value){
 let res;
        switch(typeof value){
                case "string":
                res="TEXT"
                break;
                case "number":
                if(Number.isInteger(value)) res = "INTEGER" 
                else res = "NUMERIC" 
                break; 
                case "object":
                res = "JSON" 
                break; 
        }
        return res 
    }
    get size (){
       return this.cache.size 
    }
    get values(){
        return this.cache.allValues().map(x=>x.value)
    }
    get vars(){
        this.cache.allKeys() 
    }
    add(data){
        data.type = this.findType(data.value) 
        this.cache.set(data.name,new Variable(data))
    }
    delete(name){
        this.cache.delete(name) 
    }
    get(name){
        return this.cache.get(name) 
    }

} 
module.exports = {
Variable,
VariableManager 
}