"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoiDefaultOptions = void 0;
const DurationUnits_1 = __importDefault(require("./DurationUnits"));
exports.AoiDefaultOptions = {
    insensitive: false,
    reverse: false,
    client: {
        intents: [
            "Guilds",
            "GuildMessages"
        ]
    },
    plugins: [],
    intents: [],
    prefix: [],
    units: DurationUnits_1.default
};
//# sourceMappingURL=AoiDefaultOptions.js.map