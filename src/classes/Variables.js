const Group = require("../cachehandler/index.js").cache;

class Variable {
    /**
     * TODO: define types on constructor data and methods
     */
    constructor(data = {}) {
        this.name = data.name;
        this.type = data.type;
        this.default = data.value;
        this.table = data.table;
    }

    object() {
        let x = {};
        Object.assign(x, this);
        return x;
    }

    toJSON() {
        return JSON.stringify(this.object(), null, 2);
    }

    entries() {
        return Object.entries(this);
    }

    get toArray() {
        return Object.values(this);
    }

    checkType(value) {
        let res = true;
        if (this.type === "TEXT" && typeof value !== "string") res = false;
        else if (this.type === "INTEGER" && !Number.isInteger(Number(value)))
            res = false;
        else if (this.type === "NUMERIC" && isNaN(value)) res = false;
        else if (this.type === "JSON") {
            try {
                JSON.parse(value);
            } catch (E) {
                res = false;
            }
        }
        return res;
    }
}

class VariableManager {
    constructor(client) {
        this.client = client;
        this.cache = new Group();
    }

    findType(value) {
        let res;
        switch (typeof value) {
            case "string":
                res = "TEXT";
                break;
            case "number":
                if (Number.isInteger(value)) res = "INTEGER";
                else res = "NUMERIC";
                break;
            case "object":
                res = "JSON";
                break;
        }
        return res;
    }

    parseData(value, type) {
        if (type === "NUMERIC" || type === "INTEGER") {
            if (!isNaN(value)) return Number(value);
        } else if (type === "JSON") {
            try {
                return JSON.parse(value);
            } catch (e) {
                return;
            }
        } else return value;
    }

    get size() {
        return this.cache.size;
    }

    get values() {
        return this.cache.allValues().map((x) => x.value);
    }

    get vars() {
        return this.cache.allKeys();
    }

    add(data) {
        data.type = this.findType(data.value);
        this.cache.set(data.name, new Variable(data));
    }

    delete(name) {
        this.cache.delete(name);
    }

    get(name) {
        return this.cache.get(name);
    }

    has(name, table = this.client.db.tables[0]) {
        return this.cache.find(x => x.name === name && x.table === table);
    }

    toJSON() {
        const keys = this.cache.allKeys();
        const values = this.cache.allValues();
        const json = keys.map((x) => this.cache.get(x).toJSON());
        return (
            "{\n" + keys.map((x, y) => `"${x}" : ${json[y]} `).join(",\n") + "\n}"
        );
    }
}

module.exports = {
    Variable,
    VariableManager,
};
