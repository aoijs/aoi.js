/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);

    const minutes = new Date(new Date().toLocaleString("en-us", { timeZone: d.timezone })).getMinutes();
    data.result = String(minutes).padStart(2, "0");
    
    return {
        code: d.util.setCode(data)
    }
}