const aoiDb = require("dbdjs.db");
const AoiError = require("./AoiError.js");

class Database {
    constructor(
        DbModule,
        options = {path: "./database/", tables: ["main"]},
        promisify = false,
    ) {
        this.path = options.path;
        this.tables = options.tables || ["main"];
        this.module = DbModule;

        this.promisify = promisify || false;
    }

    set(table, name, id, value) {
        this.db.set(table, id ? `${name}_${id}` : name, value);
    }

    get(table, name, id) {
        if (!this.promisify) return this.db.get(table, id ? `${name}_${id}` : name);
        else
            return new Promise((res) =>
                res(this.db.get(table, id ? `${name}_${id}` : name)),
            );
    }

    async all(table, varname, lengthofId, funconId) {
        if (!varname) {
            return await this.db.all(table);
        } else {
            const all = await this.db.all(table, {
                filter: (x) =>
                    x.key.startsWith(`${varname}_`) &&
                    (lengthofId
                        ? x.key.split("_").slice(1).length === lengthofId
                        : true) &&
                    (funconId ? this.checkConditionOnId(x.key, ...funconId) : true),
            });
            return all;
        }
    }

    checkConditionOnId(id, position, value) {
        id = id.split("_").slice(1);
        return id[position] === value;
    }

    delete(table, name, id) {
        if (!this.promisify)
            return this.db.delete(table, id ? `${name}_${id}` : name);
        else
            return new Promise((res) =>
                res(this.db.delete(table, id ? `${name}_${id}` : name)),
            );
    }

    get ping() {
        const start = Date.now();
        this.db.all(this.tables[0]);
        return Date.now() - start;
    }
}

class AoijsAPI extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisify);
        this.type = db.type || "default";
        this.createTable(this.type);
        this.extraOptions = extraOptions;
    }

    createTable(type) {
        if (["default", "dbdjs.db"].includes(type)) {
            const tables = this.tables.map((x) => ({name: x}));
            this.db = new aoiDb.Database({
                path: this.path,
                tables: tables,
                maxFileData: 10000,
                cache: 10000,
                saveTime: 3,
                getTime: 1,
                allTime: 2,
                deleteTime: 4,
            });
            this.db.connect();

            this.module = aoiDb;
        } else if (type === "dbdjs.mongo") {
            this.db = this.module.default;
            this.tables.forEach((x) => this.db.createModel(x));
        } else if (type === "aoi.fb") {
            this.db = this.module;
        } else if (type === "dbdjs.db-sql") {
            this.db = this.module.PromisedDatabase(
                this.path.replace("./", "") + "/database.sql",
                this.extraOptions.sqlOptions || {timeout: 5000},
            );
        }
    }
}

class DbdTsDb extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisify);
        this.createSetUp();
        this.extraOptions = extraOptions;
        this.type = db.type;
    }

    createSetUp() {
        const {Database, Table, Column, ApiDatabase} = this.module;
        if (!this.extraOptions?.dbdtsType) {
            this.db = new Database({
                path: this.path.endsWith("/")
                    ? this.path + "database.sql"
                    : this.path + "/database.sql",
            });
            this.tables.forEach((x) =>
                this.db.addTable(
                    new Table(x, this.db, [
                        {name: "key", type: "TEXT", primary: true},
                        {name: "invite_tracker", type: "JSON", default: {}},
                        {name: "cooldown", type: "TEXT", default: "0"},
                        {name: "setTimeout", type: "JSON", default: {}},
                    ]),
                ),
            );
        } else if (this.extraOptions?.dbdtsType === "api") {
        }
    }

    checkConditionOnId(id, position, value) {
        id = id.split("_");
        return id[position] === value;
    }

    set(table, name, id, value) {
        const data = {};
        data.key = id;
        data[name] = value;
        this.db.set(table, data);
    }

    get(table, name, id) {
        let data = this.db.get(table, {
            where: {
                column: "key",
                equals: id,
            },
        });
        return new Promise((res) =>
            res({
                value: data[name],
            }),
        );
    }

    all(table, varname, lengthofId, funconId) {
        if (!varname) {
            return new Promise((res) => res(this.db.all(table)));
        } else {
            const all = this.db.all(table);
            new Promise((res) =>
                res(
                    all.filter(
                        (x) =>
                            x[varname] &&
                            (lengthofId ? x.key.split("_").length === lengthofId : true) &&
                            (funconId ? this.checkConditionOnId(x.key, ...funconId) : true),
                    ),
                ),
            );
        }
    }

    delete(table, name) {
        this.db.delete(table, {where: {column: name}});
    }

    addColumns(table, data) {
        this.db.tables.get(table).addColumns(data);
        this.db.connect();
    }
}

class AoiMongoDb extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisify)

        this.extraOptions = extraOptions
        this.type = db.type
        this.setup()
    }

    setup() {
        const { Mongo } = this.module
        const { MongoClient } = require("mongodb")

        const mongoClient = new MongoClient(this.path, this.extraOptions.clientOptions)
        const preClient = mongoClient.connect()

        this.preClient = preClient.catch(() => {})

        preClient
            .then(client => {
                this.db = client.db(this.extraOptions.databaseName)
                /** @type {Map<string, import("aoi.mongo").Mongo>} */
                this.collections = new Map()

                for (const collectionName of this.tables) {
                    const mongo = new Mongo({
                        client,
                        dbName: this.extraOptions.databaseName,
                        collectionName
                    })

                    this.collections.set(collectionName, mongo)
                }
            })
            .catch(error => {
                this.error = error
                throw error
            })
    }

    async set(table, name, id, value) {
        await this.preClient
        if (this.error) throw this.error

        const mongo = this.collections.get(table)
        const key = `${name}_${id}`

        const res = await mongo.set(key, value)
        return !!res.upsertedCount || !!res.modifiedCount
    }

    async get(table, name, id) {
        await this.preClient
        if (this.error) throw this.error

        const mongo = this.collections.get(table)
        const key = `${name}_${id}`

        return mongo.get(key)
    }

    async all(table, varName, lengthOfId, funcOnId) {
        await this.preClient
        if (this.error) throw this.error

        const mongo = this.collections.get(table)
        let cursor

        if (!varName) {
            cursor = await mongo.all()
        } else {
            const regex = this.regExpOf(varName, lengthOfId, funcOnId)
            cursor = await mongo.match(regex)
        }

        const documents = []
        for await (const doc of cursor) {
            documents.push(doc)
        }

        return documents
    }

    async delete(table, name, id) {
        await this.preClient
        if (this.error) throw this.error

        const mongo = this.collections.get(table)
        const key = `${name}${id ? `_${id}` : ""}`

        const res = await mongo.delete(key)
        return !!res.deletedCount
    }

    async roundTrip() {
        await this.preClient
        if (this.error) throw this.error

        const before = Date.now()
        await this.db.command({ ping: 1 })

        return Date.now() - before
    }

    regExpOf(varName, lengthOfId, funcOnId) {
        const ids = []

        for (let i = 0; i < lengthOfId; i++) {
            ids.push("\\d+")
        }

        if (funcOnId) {
            const [ index, id ] = funcOnId
            ids[index] = this.escapeRegExp(String(id))
        }

        const name = this.escapeRegExp(varName)

        return new RegExp(`^${name}${ids.length ? `_${ids.join("_")}` : ".+"}$`)
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    static get defaultOptions() {
        return {
            clientOptions: { keepAlive: true },
            databaseName: "aoijs"
        }
    }
}

class CustomDb extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisfy);
        this.type = db.type;
        this.extraOptions = extraOptions;
        this.methods = Object.getOwnPropertyNames(this.module);
        this.tableList = {};
        this.createTables();
    }

    createTables() {
        let method = this.methods.filter((x) => x.includes("table"));
        if (method.length === 1) method = method[0];
        else if (method.length >= 2)
            method = method.find((x) => x.includes("create"));
        else method = method[0];

        if (!method)
            return AoiError.consoleError(
                "DatabaseSupportError",
                "This Database Is Not Supported, Make an issue at aoi.js Github",
            );
        this.tables.forEach(
            (x) => (this.tableList[x] = new this.module[method](x)),
        );
    }

    set(table, name, id, value) {
        try {
            this.tableList[table].set(!id ? name : `${name}_${id}`, value);
        } catch (e) {
            AoiError.consoleError(
                "DatabaseSupportError",
                "This Database Is Not Supported, Make an issue at aoi.js Github",
            );
        }
    }

    async get(table, name, id) {
        try {
            const eee = await this.tableList[table].get(
                `${!id ? name : `${name}_${id}`}`,
            );
            return typeof eee === "object" ? eee : {value: eee};
        } catch (e) {
            AoiError.consoleError(
                "DatabaseSupportError",
                "This Database Is Not Supported, Make an issue at aoi.js Github",
            );
        }
    }

    async all(table, varname, lengthofId, funconId) {
        try {
            if (!varname) {
                return this.tableList[table].all();
            } else {
                const all = await this.tableList[table].all();
                all.filter((x) => {
                    if (x.key) {
                        return (
                            x.key.startsWith(`${varname}_`) &&
                            (lengthofId
                                ? x.key.split("_").length === lengthofId + 1
                                : true) &&
                            (funconId ? this.checkConditionOnId(x.key, ...funconId) : true)
                        );
                    } else if (x.id) {
                        return (
                            x.id.startsWith(`${varname}_`) &&
                            (lengthofId ? x.id.split("_").length === lengthofId + 1 : true) &&
                            (funconId ? this.checkConditionOnId(x.id, ...funconId) : true)
                        );
                    }
                    if (x.ID) {
                        return (
                            x.ID.startsWith(`${varname}_`) &&
                            (lengthofId ? x.ID.split("_").length === lengthofId + 1 : true) &&
                            (funconId ? this.checkConditionOnId(x.ID, ...funconId) : true)
                        );
                    }
                    if (x.Id) {
                        return (
                            x.Id.startsWith(`${varname}_`) &&
                            (lengthofId ? x.Id.split("_").length === lengthofId + 1 : true) &&
                            (funconId ? this.checkConditionOnId(x.Id, ...funconId) : true)
                        );
                    } else {
                        AoiError.consoleError(
                            "DatabaseSupportError",
                            "This Database Is Not Supported, Make an issue at aoi.js Github",
                        );
                    }
                });
                return all;
            }
        } catch (e) {
            AoiError.consoleError(
                "DatabaseSupportError",
                "This Database Is Not Supported, Make an issue at aoi.js Github",
            );
        }
    }

    delete(table, name, id) {
        try {
            this.tableList[table].delete(!id ? name : `${name}_${id}`);
        } catch (e) {
            AoiError.consoleError(
                "DatabaseSupportError",
                "This Database Is Not Supported, Make an issue at aoi.js Github",
            );
        }
    }
}

class Promisify extends CustomDb {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db, extraOptions);
    }

    async get(table, name, id, value) {
        return new Promise((res) =>
            res(super.get(table, id ? `${name}_${id}` : name, value)),
        );
    }

    async all(table, varname, lengthofId, funconId) {
        return new Promise((res) =>
            res(super.all(table, varname, lengthofId, funconId)),
        );
    }
}

module.exports = {
    AoijsAPI,
    DbdTsDb,
    AoiMongoDb,
    CustomDb,
    Promisify,
};
