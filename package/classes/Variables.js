const Group = require('../CacheHandler/index.js').cache
class Variable {
    constructor(data = {}) {
        this.name = data.name
        this.type = data.type
        this.default = data.value

    }
    object() {
        let x = {}
        Object.assign(x, this)
        return x
    }
    toJSON() {
        return JSON.stringify(this.object(), null, 2)
    }
    entries() {
        return Object.entries(this)
    }
    get toArray() {
        return Object.values(this)
    }
}
class VariableManager {
    constructor(client) {
        this.client = client
        this.cache = new Group()
    }
    findType(value) {
        let res;
        switch (typeof value) {
            case "string":
                res = "TEXT"
                break;
            case "number":
                if (Number.isInteger(value)) res = "INTEGER"
                else res = "NUMERIC"
                break;
            case "object":
                res = "JSON"
                break;
        }
        return res
    }
    get size() {
        return this.cache.size
    }
    get values() {
        return this.cache.allValues().map(x => x.value)
    }
    get vars() {
        return this.cache.allKeys()
    }
    add(data) {
        data.type = this.findType(data.value)
        this.cache.set(data.name, new Variable(data))
    }
    delete(name) {
        this.cache.delete(name)
    }
    get(name) {
        return this.cache.get(name)
    }
    has(name) {
        return this.cache.has(name);
    }
    toJSON() {
        const keys = this.cache.allKeys();
        const values = this.cache.allValues();
        const json = keys.map(x => this.cache.get(x).toJSON())
        return "{\n" + keys.map((x, y) => `"${x}" : ${json[y]} `).join(",\n") + "\n}"
    }
}
module.exports = {
    Variable,
    VariableManager
}