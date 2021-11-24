const units = {
    byte: 1,
    kiloByte: 1024,
    megaByte: (1024 ** 2),
    gigaByte: (1024 ** 3),

    bit: 1 / 8,
    kiloBit: (1024 / 8),
    megaBit: (1024 ** 2) / 8,
    gigaBit: (1024 ** 3) / 8

};
[units.B, units.KB, units.MB, units.GB, units.b, units.kb, units.mb, units.gb] = Object.values(units);

const {statSync} = require('fs');
module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [path, unit = "b"] = data.inside.splits;
    try {
        data.result = statSync(process.cwd() + `/${path}`)?.size / units[unit];
    } catch (e) {
        d.aoiError.fnError(d, "custom", {}, e);
    }

    return {
        code: d.util.setCode(data)
    }
} 