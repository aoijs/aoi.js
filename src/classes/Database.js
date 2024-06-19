const aoidb = require("@aoijs/aoi.db");
const AoiError = require("../classes/AoiError.js");

class Database {
  /**
   * @type {aoidb.KeyValue | aoidb.Transmitter} db
   * @type {boolean} ready
   * @type {number} readyAt
   * @type {"aoi.db"} type
   * @type {"KeyValue" | "Transmitter"} moduleType
   * @type {string[]} tables
   */
  db;
  ready = false;
  readyAt = 0;
  type;
  tables = [];
  moduleType = "KeyValue";
  /**
   * Description
   * @param moduleType
   * @param {any} module
   * @param {"KeyValue" | "Transmitter"} type
   * @param {aoidb.KeyValueOptions | aoidb.TransmitterOptions} config
   * @returns {any}
   */
  constructor(moduleType, module, type, config, aoiOptions) {
    this.moduleType = type;
    this.db = new module[type](config);
    this.tables = config.dataConfig.tables;
    this.type = moduleType;
    if (aoiOptions?.aoiLogs !== false) {
      this.db.on(aoidb.DatabaseEvents.Connect, () => {
        AoiError.createConsoleMessage(
          [
            {
              text: `Successfully connected ${type} database`,
              textColor: "green",
            },
          ],
          "white",
          { text: "@aoijs/aoi.db  ", textColor: "cyan" }
        );
        this.ready = true;
        this.readyAt = Date.now();
      });
    }

    this.db.connect();
  }

  async set(table, key, id, value) {
    return await this.db.set(table, id ? `${key}_${id}` : key, { value });
  }

  async get(table, key, id) {
    return await this.db.get(table, id ? `${key}_${id}` : key);
  }

  async delete(table, key, id) {
    return await this.db.delete(table, id ? `${key}_${id}` : key);
  }

  async all(table, query, limit, type) {
    return await this.db.all(table, query, limit, type);
  }

  async has(table, key, id) {
    return await this.db.has(table, id ? `${key}_${id}` : key);
  }

  async deleteMany(table, query) {
    return await this.db.deleteMany(table, query);
  }

  async findOne(table, query) {
    return await this.db.findOne(table, query);
  }

  async findMany(table, query, limit) {
    return await this.db.findMany(table, query, limit);
  }
}

module.exports = Database;
