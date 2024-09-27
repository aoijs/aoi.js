
/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    
    const seconds = new Date(new Date().toLocaleString("en-us", { timeZone: d.timezone })).getSeconds();
    data.result = String(seconds).padStart(2, "0");

    return {
        code: d.util.setCode(data)
    };
};
