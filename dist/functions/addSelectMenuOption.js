"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const typings_1 = require("../typings");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const createRuntimeError_1 = __importDefault(require("../util/functions/createRuntimeError"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$addSelectMenuOption',
    brackets: true,
    description: "Adds a option to a select menu.",
    fields: [
        {
            name: "title",
            description: "the option title.",
            required: true,
            type: "STRING"
        },
        {
            name: "description",
            description: "the option description",
            type: "STRING",
            required: true
        },
        {
            type: "STRING",
            name: "value",
            description: "the value given by the developer for this option",
            required: true
        },
        {
            type: "STRING",
            required: false,
            description: "the emoji for this option",
            name: "emoji"
        },
        {
            name: "default",
            description: "whether this option is the default one.",
            type: "BOOLEAN",
            required: false,
            default: () => false
        }
    ],
    execute: async function (d) {
        return await this.manage(await d.resolveArray(this), ([title, desc, value, emoji, def]) => {
            const row = this.container.data.components.at(-1);
            if (!row) {
                return (0, createRuntimeError_1.default)(this, d, typings_1.RuntimeErrorType.OTHER, "No row found to add this component");
            }
            const menu = this.container.data.components[this.container.data.components.length - 1].components[0];
            if (!(menu instanceof builders_1.SelectMenuBuilder)) {
                return (0, createRuntimeError_1.default)(this, d, typings_1.RuntimeErrorType.OTHER, ":x: Could not find select menu to add this option to.");
            }
            const selectOption = new discord_js_1.SelectMenuOptionBuilder()
                .setDefault(def ?? false)
                .setLabel(title)
                .setEmoji(emoji ?? "")
                .setValue(value)
                .setDescription(desc);
            menu.addOptions(selectOption);
            return this.ok();
        });
    }
});
//# sourceMappingURL=addSelectMenuOption.js.map