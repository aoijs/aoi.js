"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const ImageFormats_1 = require("../typings/enums/ImageFormats");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$lerefAvatar',
    description: 'Easter egg of Leref.',
    returns: 'STRING',
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async ([user, size, type]) => {
                return Return_1.Return.string(user.displayAvatarURL({
                    size: size,
                    extension: type !== null ? ImageFormats_1.ImageFormats[type] : undefined
                }));
            });
        }
        return Return_1.Return.string(this.context.getUser()?.displayAvatarURL({ forceStatic: false, size: 2048 }));
    }
});
//# sourceMappingURL=lerefAvatar.js.map