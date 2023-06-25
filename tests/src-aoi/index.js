
const { AoiClient } = require("aoi.js");
const config = require("./config.js");

const bot = new AoiClient( config.Client );

(async () => {
    await bot.managers.commands.load({ path: "./commands", usingAoi: true });
})();
