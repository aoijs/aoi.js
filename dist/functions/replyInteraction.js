"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$replyInteraction',
    description: 'the interaction will be replied to and not updated.',
    brackets: true,
    fields: [
        {
            name: 'content',
            description: 'content to use for replying to this interaction',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([content]) => {
            this.setReply('reply');
            await this.container.send(content);
            return this.ok();
        });
    }
});
//# sourceMappingURL=replyInteraction.js.map