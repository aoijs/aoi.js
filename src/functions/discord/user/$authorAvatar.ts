import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $authorAvatar: FunctionData = {
    name: "$authorAvatar",
    type: "getter",
    brackets: false,
    optional: true,
    fields: [
        {
            name: "size",
            type: "number",
            description: "The size of the avatar",
            required: false,
        },
        {
            name: "dynamic",
            type: "boolean",
            description: "Whether the avatar is dynamic",
            required: false,
        },
        {
            name: "format",
            type: "string",
            description: "The format of the avatar",
            required: false,
        }
    ],
    version: "7.0.0",
    default: ["1024", "true", "'png'"],
    returns: "string",
    description: "Returns the avatar of the author",
    example: `
        $authorAvatar // returns the avatar of the author

        $authorAvatar[4096;true;png] // returns the avatar of the author with size 4096, dynamic true and format png
    `,
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const [size=1024,dynamic=true,format="'png'"] = data.splits;

        const avatar = `__$DISCORD_DATA$__.author?.avatarUrl({size: ${size}, dynamic: ${dynamic}, format: ${format} })`;

        const res = escapeResult(`(${avatar})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
