"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeErrorType_1 = require("../typings/enums/RuntimeErrorType");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const createRuntimeError_1 = __importDefault(require("../util/functions/createRuntimeError"));
exports.default = (0, createNativeFunction_1.default)({
    brackets: true,
    returns: 'STRING',
    nullable: true,
    description: 'sends a message to a channel',
    name: '$channelSendMessage',
    fields: [
        {
            name: 'channelID',
            type: 'CHANNEL',
            required: true,
            description: 'the channel to send the message to'
        },
        {
            name: 'content',
            description: 'content to send to the channel',
            type: 'STRING'
        },
        {
            name: 'return message ID',
            type: 'BOOLEAN',
            default: () => false,
            description: 'whether to return the message ID.'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([ch, content, bool]) => {
            if (!ch.isTextBased()) {
                return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.OTHER, `Not a text channel`);
            }
            const msg = await this.container.send(content, ch);
            if (!msg) {
                return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.OTHER, `Failed to send message`);
            }
            return this.ok(bool ? msg.id : '');
        });
    }
});
//# sourceMappingURL=channelSendMessage.js.map