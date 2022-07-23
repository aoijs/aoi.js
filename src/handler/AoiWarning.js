const {default: axios} = require("axios");
const json = require("../../package.json");
module.exports = async () => {
    try {
        const res = await axios.get("https://api.leref.repl.co/package/version"); //This will change in v6 to be native.

        if (json.version !== res.data.version) {

            console.warn(
                "\x1b[31mAoiWarning: \u001b[33mv" +
                res.data.version +
                " is available to install.\u001b[0m" + " (\x1b[31mnpm i aoi.js@" + res.data.version + "\x1b[0m)")
        }
    } catch {
    }
};