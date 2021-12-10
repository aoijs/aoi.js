const {default: axios} = require("axios");
module.exports = async () => {
    const res = await axios.get("https://api.leref.ga/package/version");

    console.warn(
        "\x1b[31maoi.js warning: \u001b[33mAvailable version v" +
        res.data.version +
        " ready to install.\u001b[0m",
    )
}