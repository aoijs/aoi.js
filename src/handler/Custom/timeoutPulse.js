const AoiError = require("../../classes/AoiError.js");
const {
  AoijsAPI,
  DbdTsDb,
  CustomDb,
  Promisify,
} = require("../../classes/Database.js");

module.exports = async (d, name, duration, pulse, timeoutData, onReady) => {
  let cmds = d.client.cmd.pulse.allValues();

  if (onReady) {
    const datas = await d.client.db.all(d.client.db.tables[0], "setTimeout");
    try {
      for (const data of datas.filter((x) => {
        if (d.client.db instanceof AoijsAPI) {
          if (d.client.db.type === "aoi.db") return x.value.__pulseEvery__;
          else return x.data.value.__pulseEvery__;
        } else if (d.client.db instanceof DbdTsDb) {
          return x["setTimeout"].__pulseEvery__;
        } else if (
          d.client.db instanceof CustomDb ||
          d.client.db instanceof Promisify
        ) {
          return (
            x?.value?.__pulseEvery__ &&
            x["setTimeout"]?.__pulseEvery__ &&
            (typeof x.data === "object"
              ? x.data.value?.__pulseEvery__
              : x.data?.__pulseEvery__)
          );
        }
      })) {
        let t;

        if (d.client.db instanceof AoijsAPI) {
          if (d.client.db.type === "aoi.db") t = data.value;
          else t = data.data.value;
        } else if (d.client.db instanceof DbdTsDb) {
          t = data["setTimeout"];
        } else if (
          d.client.db instanceof CustomDb ||
          d.client.db instanceof Promisify
        ) {
          t =
            data?.value ||
            data["setTimeout"] ||
            (typeof data.data === "object" ? data.data.value : data.data);
        }
        t.__timeoutIds__ = [];
        t.__pulseIds__ = [];
        cmds = cmds.filter((x) => x.name === t.__timeoutName__);
        if ((t.__duration__ - Date.now()) > 0) {
          for (const cmd of cmds) {
            const interval = setInterval(async () => {
              await d.interpreter(
                d.client,
                {},
                [],
                cmd,
                d.client.db,
                false,
                undefined,
                { timeoutData: t },
              );
            }, t.__pulseEvery__);
            t.__pulseIds__.push(interval[Symbol.toPrimitive]());

            const timeout = setTimeout(async () => {
              clearInterval(interval);
              await d.client.db.delete(d.client.db.tables[0], data.key);
            }, t.__duration__ - Date.now());
            t.__timeoutIds__.push(timeout[Symbol.toPrimitive]());
          }
          d.client.db.set(d.client.db.tables[0], "setTimeout", t.__id__, t);
        } else {
          await d.client.db.delete(d.client.db.tables[0], data.key).catch(console.error);
        }
      }
    } catch (e) {
      console.error(e)
      AoiError.consoleError(
        "DatabaseSupportError",
        "Database Not Supported , You Can Create An Issue In Aoi.js Github.\n Error ->" + e,
      );
      console.log("Link : https://github.com/aoijs/aoi.js");
    }
  } else {
    if (name) {
      cmds = cmds.filter((x) => x.name === name);
    }
    timeoutData.__timeoutIds__ = [];
    timeoutData.__pulseIds__ = [];
    for (const cmd of cmds) {
      const interval = setInterval(() => {
        d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, {
          timeoutData,
        });
      }, pulse || duration);
        timeoutData.__pulseIds__.push(interval[Symbol.toPrimitive]());
      const timeout = setTimeout(async() => {
        clearInterval(interval);
        await d.client.db.delete(
          d.client.db.tables[0],
          "setTimeout",
          timeoutData.__id__,
        );
      }, duration);
        timeoutData.__timeoutIds__.push(timeout[Symbol.toPrimitive]());
    }
    d.client.db.set(d.client.db.tables[0], "setTimeout", timeoutData.__id__, timeoutData);
  }
};