"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicCommands_1 = __importDefault(require("../handlers/basicCommands"));
const createDiscordEventHandler_1 = require("../util/functions/createDiscordEventHandler");
exports.default = (0, createDiscordEventHandler_1.createDiscordEventHandler)("messageCreate", function (message) {
    basicCommands_1.default.call(this, message);
});
//# sourceMappingURL=messageCreate.js.map