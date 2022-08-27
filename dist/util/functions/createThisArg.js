"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../../structures/Container");
const Context_1 = require("../../structures/Context");
const ThisArg_1 = require("../../structures/ThisArg");
function default_1(data) {
    const context = new Context_1.Context(data.context);
    const container = new Container_1.Container()
        .setChannel(data.channel ?? context.getMainChannel() ?? data.context);
    return new ThisArg_1.ThisArg({
        container,
        args: data.args ?? [],
        context,
        bot: data.bot,
        command: data.command,
        ref: data
    });
}
exports.default = default_1;
//# sourceMappingURL=createThisArg.js.map