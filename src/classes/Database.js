const AoiError = require("./AoiError.js");

class Database {
  constructor(
    DbModule,
    options = { path: "./database/", tables: ["main"] },
    promisify = false,
  ) {
    this.path = options.path;
    this.tables = options.tables || ["main"];
    this.module = DbModule;

    this.promisify = promisify || false;
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
      } else if (this.extraOptions.dbType === "Transmmiter") {
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
      } else if (this.extraOptions.dbType === "Transmmiter") {
        return await this.db.get(table, name, id);
      }
    } else {
      return await super.get(table, name, id);
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
      return await super.delete(table, name, id);
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
      return typeof eee === "object" ? eee : { value: eee };
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
  CustomDb,
  Promisify,
};