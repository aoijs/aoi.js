const aoiDb = require('dbdjs.db')
const AoiError = require('./AoiError.js')
class Database {
    constructor(DbModule, options = { path: "./database/", tables: ["main"] }, promisify = false) {
        this.path = options.path
        this.tables = options.tables || ["main"]
        this.module = DbModule

        this.promisify = promisify || false
    }
    set(table, name, id, value) {
        this.db.set(table, id ? name + "_" + id : name, value)
    }
    get(table, name, id) {
        if (!this.promisify) return this.db.get(table, id ? name + "_" + id : name)
        else return new Promise(res => res(this.db.get(table, id ? name + "_" + id : name)))
    }
    all(table, filter) {
        if (!this.promisify) return this.db.all(table, { filter })
        else return new Promise(res => res(this.db.all(table, { filter })))
    }
    delete(table, name, id) {
        if (!this.promisify) return this.db.delete(table, id ? name + "_" + id : name)
        else return new Promise(res => res(this.db.delete(table, id ? name + "_" + id : name)))
    }
    get ping() {
        const start = Date.now();
        this.db.all(this.tables[0])
        return Date.now() - start
    }
}
class AoijsAPI extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisify);
        this.type = db.type || "default"
        this.createTable(this.type)
        this.extraOptions = extraOptions
    }
    createTable(type) {
        if (["default", "dbdjs.db"].includes(type)) {
            const tables = this.tables.map(x => ({ name: x }))
            this.db = new aoiDb.Database({
                path: this.path,
                tables: tables,
                maxFileData: 10000,
                cache: 10000,
                saveTime: 3,
                getTime: 1,
                allTime: 2,
                deleteTime: 4,
            })
            this.db.connect();

            this.module = aoiDb
        }
        else if (type === "dbdjs.mongo") {
            this.db = this.module.default
            this.tables.forEach(x => this.db.createModel(x))
        }
        else if (type === "dbdjs.db-sql") {
            this.db = this.module.PromisedDatabase(this.path.replace("./", "") + "/database.sql", this.extraOptions.sqlOptions || { timeout: 5000 })

        }
    }
}
class DbdTsDb extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisify);
        this.createSetUp()
        this.extraOptions = extraOptions
        this.type = db.type
    }
    createSetUp() {
        const { Database, Table, Column, ApiDatabase } = this.module
        if (!this.extraOptions?.dbdtsType) {
            this.db = new Database({ path: this.path.endsWith("/") ? this.path + "database.sql" : this.path + "/database.sql" })
            this.tables.forEach(x => this.db.addTable(new Table(x, this.db, [{ name: "id", type: "TEXT", primary: false }, { name: "invite_tracker", type: "JSON", default: {} }])))

        }
        else if (this.extraOptions?.dbdtsType === "api") {

        }

    }
    set(table, name, id, value) {
        const data = {}
        data.id = id
        data[name] = value
        this.db.set(table, data)
    }
    get(table, name, id) {
        let data = this.db.get(table, {
            where: {
                column: "id",
                equals: id
            }
        })
        return new Promise(res => res(data[name]))
    }
    all(table, filter) {
        if (!filter) return new Promise(res => res(this.db.all(table)));
        else return new Promise(res => res(this.db.all(table).filter(filter)))
    }
    delete(table, name) {
        this.db.delete(table, { where: { column: name } })
    }
    addColumns(table, data) {
        this.db.tables.get(table).addColumns(data)
        this.db.connect()
    }
}
class CustomDb extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisfy);
        this.type = db.type
        this.extraOptions = extraOptions
        this.methods = Object.getOwnPropertyNames(this.module)
        this.tableList = {}
        this.createTables();
    }
    createTables() {
        let method = this.methods.filter(x => x.includes("table"))
        if (method.length === 1) method = method[0]
        else if (method.length >= 2) method = method.find(x => x.includes("create"))
        else method = method[0]

        if (!method) return AoiError.consoleError("DatabaseSupportError", "This Database Is Not Supported, You Can Make An Issue At Aoijs GitHub")
        this.tables.forEach(x => this.tableList[x] = new this.module[method](x))
    }
    set(table, name, id, value) {
        try {
            this.tableList[table].set(!id ? name : name + "_" + id, value)
        }
        catch (e) {
            AoiError.consoleError("DatabaseSupportError", "This Database Is Not Supported, You Can Make An Issue At Aoijs GitHub")
        }
    }
    get(table, name, id) {
        try {
            this.tableList[table].get(`${!id ? name : name + "_" + id}`)
        }
        catch (e) {
            AoiError.consoleError("DatabaseSupportError", "This Database Is Not Supported, You Can Make An Issue At Aoijs GitHub")
        }
    }
    all(table, filter) {
        try {
            if (!filter) return this.tableList[table].all();
            else return this.tableList[table].all().filter(filter)
        }
        catch (e) {
            AoiError.consoleError("DatabaseSupportError", "This Database Is Not Supported, You Can Make An Issue At Aoijs GitHub")
        }
    }
    delete(table, name, id) {
        try {
            this.tableList[table].delete(!id ? name : name + "_" + id)
        }
        catch (e) {
            AoiError.consoleError("DatabaseSupportError", "This Database Is Not Supported, You Can Make An Issue At Aoijs GitHub")
        }
    }
}
class Promisify extends CustomDb {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db, extraOptions);
    }
    get(table, name, id, value) {
        return new Promise(res => res(super.get(table, id ? name + "_" + id : name, value)))
    }
    all(table) {
        return new Promise(res => res(super.all(table)))
    }
}
module.exports = {
    AoijsAPI,
    DbdTsDb,
    CustomDb,
    Promisify
}
