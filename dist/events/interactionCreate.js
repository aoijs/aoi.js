"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buttonCommands_1 = __importDefault(require("../handlers/buttonCommands"));
const createDiscordEventHandler_1 = require("../util/functions/createDiscordEventHandler");
exports.default = (0, createDiscordEventHandler_1.createDiscordEventHandler)("interactionCreate", function (i) {
    if (i.isButton()) {
        buttonCommands_1.default.call(this, i);
    }
});
//# sourceMappingURL=interactionCreate.js.map