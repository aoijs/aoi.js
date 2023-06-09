
const { Client } = require("aoi.js");
const config = require("./config.js");

const bot = new Client( config.Client );

(async () => {
    await bot.managers.commands.load({ path: "./commands", usingAoi: true });
})();
