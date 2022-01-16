const {
    AoijsAPI,
    DbdTsDb,
    CustomDb,
    Promisify,
} = require("../../../classes/Database.js");

module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [varname, table = d.client.db.tables[0]] = data.inside.splits;

    if (!d.client.variableManager.cache.has(varname.addBrackets(), table))
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Variable ${varname.addBrackets()} Doesn't Exist!`,
        );

    const all = await d.client.db.all(table, varname.addBrackets(), 1);
    if (d.client.db instanceof AoijsAPI) {
        all
            .filter(async (x) => await d.util.getGuild(d, x.key.split("_")[1]))
            .forEach(async (x) => await d.client.db.delete(table, x.key));
    } else if (d.client.db instanceof DbdTsDb) {
        all
            .filter(async (x) => await d.util.getGuild(d, x.id))
            .forEach(
                async (x) => await d.client.db.delete(table, x[varname.addBrackets()]),
            );
    } else if (
        d.client.db instanceof CustomDb ||
        d.client.db instanceof Promisify
    ) {
        all
            .filter(async (x) => {
                if (data.key) {
                    const arr = data.key.split("_");
                    return await d.util.getGuild(d, arr[1]);
                } else if (data.id) {
                    const arr = data.id.split("_");
                    return await d.util.getGuild(d, arr[1]);
                } else if (data.ID) {
                    const arr = data.ID.split("_");
                    return await d.util.getGuild(d, arr[1]);
                } else if (data.Id) {
                    const arr = data.Id.split("_");
                    return await d.util.getGuild(d, arr[1]);
                } else {
                    d.aoiError.fnError(
                        d,
                        "custom",
                        {},
                        "Database Not Supported For LeaderBoard",
                    );
                }
            })
            .forEach(
                async (x) =>
                    await d.client.db.delete(table, x.key || x.id || x.ID || x.Id),
            );
    }

    return {
        code: d.util.setCode(data),
    };
};
