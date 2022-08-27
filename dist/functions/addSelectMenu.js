"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const typings_1 = require("../typings");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const createRuntimeError_1 = __importDefault(require("../util/functions/createRuntimeError"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$addSelectMenu',
    brackets: true,
    description: "Adds a menu to an action row.",
    fields: [
        {
            name: "custom ID",
            description: "the custom ID given by the developer for this menu.",
            required: true,
            type: "STRING"
        },
        {
            name: "placeholder",
            description: "the menu placeholder",
            type: "STRING",
            required: true
        },
        {
            name: "minValues",
            description: "minimum amount of options an user has to select.",
            required: true,
            type: "NUMBER"
        },
        {
            name: "maxValues",
            description: "maximum amount of options an user can select.",
            required: true,
            type: "NUMBER"
        },
        {
            type: "BOOLEAN",
            name: "disabled",
            description: "whether this menu should appear disabled",
            required: false,
            default: () => false
        }
    ],
    execute: async function (d) {
        return await this.manage(await d.resolveArray(this), ([customOrLink, label, min, max, disabled]) => {
            const row = this.container.data.components.at(-1);
            if (!row) {
                return (0, createRuntimeError_1.default)(this, d, typings_1.RuntimeErrorType.OTHER, "No row found to add this component");
            }
            const select = new builders_1.SelectMenuBuilder()
                .setPlaceholder(label)
                .setDisabled(disabled)
                .setCustomId(customOrLink)
                .setMinValues(min)
                .setMinValues(max);
            row.addComponents(select);
            return this.ok();
        });
    }
});
//# sourceMappingURL=addSelectMenu.js.map