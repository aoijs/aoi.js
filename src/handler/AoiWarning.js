const {default: axios} = require("axios");
const json = require("../../package.json");
module.exports = async () => {
    try {
        const res = await axios.get("https://api.leref.ga/package/version");

        if (json.version !== res.data.version) {

            console.warn(
                "\x1b[31maoi.js warning: \u001b[33mv" +
                res.data.version +
                " is available to install.\u001b[0m" + " (npm i aoi.js@" + res.data.version + ")")
        }
    } catch {
    }
};