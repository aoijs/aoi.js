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
    description: 'edits a message of a channel',
    name: '$editMessage',
    fields: [
        {
            name: 'channelID',
            type: 'CHANNEL',
            required: true,
            description: 'the channel to '
        },
        {
            name: 'messageID',
            type: 'MESSAGE',
            required: true,
            pointer: 0,
            description: 'the message to edit.'
        },
        {
            name: 'content',
            description: 'content to use for this message',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([, msg, content]) => {
            this.setReply('edit');
            const message = await this.container.send(content, msg);
            if (!message) {
                return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.OTHER, `Failed to edit message`);
            }
            return this.ok();
        });
    }
});
//# sourceMappingURL=editMessage.js.map