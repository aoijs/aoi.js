"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDiscordEventHandler_1 = require("../util/functions/createDiscordEventHandler");
exports.default = (0, createDiscordEventHandler_1.createDiscordEventHandler)("ready", function () {
    console.log(`Ready on Client || ${this.client.user.tag}!`);
    console.log("Initialized on \x1b[36maoi.js \x1b[0m|| \x1b[32mv" +
        require("../../package.json").version +
        "\x1b[0m || Akarui Development ");
});
//# sourceMappingURL=DefaultReadyLogger.js.map