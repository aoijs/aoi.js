"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const RuntimeErrorType_1 = require("../typings/enums/RuntimeErrorType");
const createEnum_1 = __importDefault(require("../util/functions/createEnum"));
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const createRuntimeError_1 = __importDefault(require("../util/functions/createRuntimeError"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$addButton',
    brackets: true,
    optional: false,
    description: 'Creates a button for an action row',
    fields: [
        {
            name: 'label',
            description: 'the button label',
            required: true,
            type: 'STRING'
        },
        {
            name: 'custom ID',
            description: 'the custom ID for this button',
            required: true,
            type: 'STRING'
        },
        {
            name: 'style',
            description: 'the button style',
            type: 'ENUM',
            choices: (0, createEnum_1.default)(discord_js_1.ButtonStyle),
            required: true
        },
        {
            name: 'emoji',
            description: 'the emoji to use for this button',
            type: 'STRING'
        },
        {
            name: 'disabled',
            type: 'BOOLEAN',
            description: 'whether this button should appear disabled.'
        }
    ],
    execute: async function (d) {
        return await this.manage(await d.resolveArray(this), ([label, id, style, emote, disabled]) => {
            const row = this.container.data.components.at(-1);
            if (!row) {
                return (0, createRuntimeError_1.default)(this, d, RuntimeErrorType_1.RuntimeErrorType.OTHER, "No row found to add this component");
            }
            const btn = new builders_1.ButtonBuilder()
                .setLabel(label)
                .setCustomId(id)
                .setStyle(style);
            if (emote) {
                const got = (0, discord_js_1.parseEmoji)(emote);
                btn.setEmoji({
                    animated: got.animated,
                    id: got.id,
                    name: got.name
                });
            }
            if (typeof disabled === 'boolean') {
                btn.setDisabled(disabled);
            }
            row.addComponents(btn);
            return this.ok();
        });
    }
});
//# sourceMappingURL=addButton.js.map