const AoiError = require("../../classes/AoiError.js");
const {
  DbdTsDb,
  AoijsAPI,
  CustomDb,
  Promisify,
} = require("../../classes/Database.js");

module.exports = async (d, name, duration, timeoutData, onReady) => {
  let cmds = d.client.cmd.timeout.allValues();
  if (onReady) {
    const datas = await d.client.db.all(d.client.db.tables[0], "setTimeout");
    try {
      for (const data of datas.filter((x) => {
        if (d.client.db instanceof AoijsAPI) {
          if (d.client.db.type === "aoi.db") return !x.value.__pulseEvery__;
          else return !x.data.value.__pulseEvery__;
        } else if (d.client.db instanceof DbdTsDb) {
          return !x["setTimeout"].__pulseEvery__;
        } else if (
          d.client.db instanceof CustomDb ||
          d.client.db instanceof Promisify
        ) {
          return (
            !x?.value?.__pulseEvery__ &&
            !x["setTimeout"]?.__pulseEvery__ &&
            (typeof x.data === "object"
              ? !x.data.value?.__pulseEvery__
              : !x.data?.__pulseEvery__)
          );
        }
      })) {
        let t;

        if (d.client.db instanceof AoijsAPI) {
          if(d.client.db.type === "aoi.db") t = data.value;
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
        const dura = t.__duration__ - Date.now();
        cmds = cmds.filter((x) => x.name === t.__timeoutName__);
        if (dura > 0) {
          for (const cmd of cmds) {
            const timeout = setTimeout(async () => {
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
              t.__timeoutIds__.push(timeout[Symbol.toPrimitive]());

              await d.client.db.delete(d.client.db.tables[0], data.key);
            }, dura);
          }
          d.client.db.set(d.client.db.tables[0], "setTimeout", t.__id__, t);
        } else {
          for(const cmd of cmds) {
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
          }
          await d.client.db.delete(d.client.db.tables[0], data.key);
          continue;
        }
      }
    } catch (e) {
      AoiError.consoleError(
        "DatabaseSupportError",
        "Database Not Supported , You Can Create An Issue At aoi.js Github. \n Error : " +e,
      );
      console.log("Link : https://github.com/aoijs/aoi.js");
    }
  } else {
    timeoutData.__timeoutIds__ = [];
    if (name) {
      cmds = cmds.filter((x) => x.name === name);
    }
    const ids = [];
    for (const cmd of cmds) {
      const timeout = setTimeout(async () => {
        await d.interpreter(
          d.client,
          {},
          [],
          cmd,
          d.client.db,
          false,
          undefined,
          { timeoutData },
        );

        d.client.db.delete(
          d.client.db.tables[0],
          "setTimeout",
          timeoutData.__id__,
        );
      }, duration);
      ids.push(timeout[Symbol.toPrimitive]());
    }
    timeoutData.__timeoutIds__ = ids;
    await d.client.db.set(
      d.client.db.tables[0],
      "setTimeout",
      timeoutData.__id__,
      timeoutData,
    );
  }
};