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
        this.db = AoijsAPI
    }

    get ping() {
        const start = Date.now();
        this.db.all(this.tables[0]);
        return Date.now() - start;
    }

    async set(table, name, id, value) {
        await this.db.set(table, id ? `${name}_${id}` : name, value);
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
            return await this.db.all(table, {
                filter: (x) =>
                    x.key.startsWith(`${varname}_`) &&
                    (lengthofId
                        ? x.key.split("_").slice(1).length === lengthofId
                        : true) &&
                    (funconId ? this.checkConditionOnId(x.key, ...funconId) : true),
            });
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
}

class AoijsAPI extends Database {
    constructor(module, options = {}, db = {}, extraOptions = {}) {
        super(module, options, db.promisify);
        this.type = db.type || "aoi.db";
        if (this.type === "default") this.type = "aoi.db";
        this.extraOptions = extraOptions;
        this.createTable(this.type);
    }

    createTable(type) {
        if (type === "aoi.db" || type === "default") {
            if (!this.extraOptions.dbType) this.extraOptions.dbType = "KeyValue";
            this.db = new this.module[this.extraOptions.dbType || "KeyValue"]({
                path: this.path,
                tables: this.tables,
                ...(this.extraOptions ?? {}),
            });
            this.db.connect();
        }
    }

    async set(table, name, id, value) {
        if (this.type === "aoi.db") {
            if (this.extraOptions.dbType === "KeyValue") {

                await this.db.set(table, id ? `${name}_${id}` : name, {value});
            } else if (this.extraOptions.dbType === "WideColumn") {
                return await this.db.set(
                    table,
                    {name: name, value},
                    {name: "id", value: id},
                );
            } else if (this.extraOptions.dbType === "Transmitter") {
                if (this.extraOptions.dbOptions.databaseType === "KeyValue")
                    return await this.db.set(table, name, id);
                else if (this.extraOptions.dbOptions.databaseType === "WideColumn")
                    return await this.db.set(
                        table,
                        {name: name, value},
                        {name: "id", value: id},
                    );
            }
        } else {
            await super.set(table, name, id, value);
        }
    }

    async get(table, name, id) {
        if (this.type === "aoi.db") {
            if (this.extraOptions.dbType === "KeyValue") {
                return await this.db.get(table, id ? `${name}_${id}` : name);
            } else if (this.extraOptions.dbType === "WideColumn") {
                return await this.db.get(table, name, id);
            } else if (this.extraOptions.dbType === "Transmitter") {
                return await this.db.get(table, name, id);
            }
        } else {
            return super.get(table, name, id);
        }
    }

    async all(table, varname, lengthofId, funconId) {
        if (this.type === "aoi.db") {
            return await this.db.all(
                table,
                (x) =>
                    x.startsWith(`${varname}_`) &&
                    (lengthofId ? x.split("_").slice(1).length === lengthofId : true) &&
                    (funconId ? this.checkConditionOnId(x, ...funconId) : true),
                Infinity,
            );
        } else {
            return await super.all(table, varname, lengthofId, funconId);
        }
    }

    async delete(table, name, id) {
        if (this.type === "aoi.db") {
            return await this.db.delete(table, id ? `${name}_${id}` : name);
        } else {
            return super.delete(table, name, id);
        }
    }
}

module.exports = {
    AoijsAPI
};