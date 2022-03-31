"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const ImageFormats_1 = require("../typings/enums/ImageFormats");
const createEnum_1 = __importDefault(require("../util/functions/createEnum"));
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$userAvatar',
    description: 'displays the user avatar.',
    brackets: true,
    optional: true,
    returns: 'STRING',
    fields: [
        {
            name: 'userID',
            description: 'the user to get the avatar of.',
            type: 'USER',
            required: true
        },
        {
            name: 'size',
            description: 'the size to apply to the image',
            required: false,
            type: 'NUMBER',
            default: () => 2048
        },
        {
            name: 'type',
            description: 'the type to apply to the image',
            type: 'ENUM',
            default: () => undefined,
            choices: (0, createEnum_1.default)(ImageFormats_1.ImageFormats),
        }
    ],
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
//# sourceMappingURL=userAvatar.js.map