const Group = require('../CacheHandler/index.js').cache 
class Variable {
    /**
     * 
     * @param {{name: string, type: 'string' | 'number' | 'object', value: any}} [data={}]
     */
    constructor(data){
        /** @type {string} */
        this.name = data.name 
        /**@private @type {'string' | 'number' | 'object'} */
        this._type = data.type 
        /** @type {*} */
        this.default = data.value 
    }

    static get types() {
        return ['string', 'number', 'object']
    }

    get type() {
        return this._type;
    }

    set type(newValue) {
        if(!Variable.types.includes(newValue)) throw new Error("VariableTypeError: Invalid Type : " + String(newValue));
        this._type = newValue;
    }

    setType(type){
        this.type = type;
    }

    object(){
        let x = {}
        Object.assign(x,this) 
        return x;
    }

    toJSON() {
        return {
            name: this.name,
            type: this.type,
            default: this.value,
            value: this.value
        }
    }
}
class VariableManager {
    constructor(client){
        this.client = client 
        this.cache = new Group() 
    }
    findType(value){
        let res;
        switch (typeof value) {
            case "string": res="TEXT"
            break;
            case "number": {
                if(Number.isInteger(value)) res = "INTEGER" 
                else res = "NUMERIC";
            } 
            break; 
            case "object": res = "JSON" 
            break; 
        }
        return res;
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
        this.cache.set(data.name, new Variable(data))
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