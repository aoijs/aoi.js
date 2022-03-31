"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$updateInteraction',
    description: 'the interaction will be updated and not replied to.',
    brackets: true,
    optional: true,
    fields: [
        {
            name: 'content',
            description: 'content to use for replying to this interaction',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async ([content]) => {
                this.setReply('update');
                await this.container.send(content);
                return this.ok();
            });
        }
        this.setReply('update');
        return this.ok();
    }
});
//# sourceMappingURL=updateInteraction.js.map