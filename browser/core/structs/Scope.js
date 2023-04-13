import { TranspilerCustoms } from "../../typings/enums.js";
import { escapeResult, escapeVars, parseResult, removeMultiLineComments, removeSetFunc, } from "../../util/transpilerHelpers.js";
import fixMath from "../parsers/mathParser.js";
import { parseString } from "../parsers/stringParser.js";
export default class Scope {
    name;
    parent;
    children = [];
    sendData;
    embeds = [];
    components = [];
    files = [];
    stickers = [];
    env;
    ephemeral = false;
    variables;
    setters;
    objects;
    rest;
    hasSendData;
    sendFunction;
    functions;
    addReturn;
    useChannel;
    packages = "";
    constructor(name, parent, code, addReturn) {
        this.name = name;
        this.sendFunction = "__$DISCORD_DATA$__.client.createMessage";
        this.parent = parent;
        this.hasSendData = false;
        this.sendData = {
            content: code?.replaceAll("`", TranspilerCustoms.SL) || " ",
        };
        this.variables = [];
        this.objects = {};
        this.env = [];
        this.setters = "";
        this.functions = "";
        this.rest = code?.replaceAll("`", TranspilerCustoms.SL) || "";
        this.addReturn = addReturn ?? false;
    }
    addVariables(scopeVars) {
        this.variables.push(...scopeVars);
    }
    addEmbeds(embeds) {
        this.embeds = [...this.embeds, ...embeds];
    }
    addFunction(func) {
        this.functions += func + " \n";
    }
    replaceLast(str, replacer, replacedTo) {
        const index = str.lastIndexOf(replacer);
        if (index === -1)
            return str;
        return (str.substring(0, index) +
            replacedTo +
            str.substring(index + replacer.length));
    }
    replace(str, replacer, replacedTo) {
        const index = str.indexOf(replacer);
        if (index === -1)
            return str;
        return (str.substring(0, index) +
            replacedTo +
            str.substring(index + replacer.length));
    }
    addChild(child) {
        this.children.push(new Scope(child, this.name));
    }
    getChild(name) {
        return this.children.find((child) => child.name === name);
    }
    removeChild(name) {
        this.children = this.children.filter((child) => child.name !== name);
    }
    toString(sendMessage = true) {
        const sendData = { ...this.sendData };
        sendData.embeds = escapeResult(escapeVars(`${this.name}_embeds`));
        sendData.components = escapeResult(escapeVars(`${this.name}_components`));
        sendData.files = escapeResult(escapeVars(`${this.name}_files`));
        sendData.stickers = escapeResult(escapeVars(`${this.name}_stickers`));
        sendData.content = sendData.content.replaceAll("\n", TranspilerCustoms.NL);
        if (sendData.content.replaceAll(TranspilerCustoms.NL, "").trim() !==
            "" ||
            this.embeds.length ||
            this.files.length ||
            this.stickers.length)
            this.hasSendData = true;
        else
            this.hasSendData = false;
        let parsedStr = parseString(sendData.content.replaceAll(TranspilerCustoms.NL, "\n").trim());
        parsedStr =
            parsedStr.trim().replaceAll(TranspilerCustoms.SL, "\\`") === ""
                ? " "
                : parsedStr.trim().replaceAll(TranspilerCustoms.SL, "\\`");
        this.rest = this.replaceLast(parseResult(removeMultiLineComments(this.rest.trim())), this.sendData.content.trim(), "");
        parsedStr = parsedStr.replaceAll("\\n", TranspilerCustoms.NL);
        const sent = `{
  content: ${fixMath(parsedStr.trim() === "``" ? "` `" : parsedStr)},
  embeds: ${escapeVars(`${this.name}_embeds`)},
  components: ${escapeVars(`${this.name}_components`)},
  files: ${escapeVars(`${this.name}_files`)},
  stickers: ${escapeVars(`${this.name}_stickers`)},
    }`.replaceAll(TranspilerCustoms.NL, "\\\\n");
        return parseResult(`const ${escapeVars(`${this.name}_embeds`)} = [];\n` +
            `const ${escapeVars(`${this.name}_components`)} = [];\n` +
            `const ${escapeVars(`${this.name}_files`)} = [];\n` +
            `const ${escapeVars(`${this.name}_stickers`)} = [];\n` +
            `${this.packages}` +
            `${this.setters}\n\n${this.functions}\n\n${this.rest.trim()}\n\n`.trim() +
            `\n${(() => {
                if (this.hasSendData && sendMessage) {
                    return `${this.addReturn ? "return " : ""} await ${this.useChannel
                        ? `__$DISCORD_DATA$__.client.createMessage(${parseString(this.useChannel.toString() +
                            (!isNaN(Number(this.useChannel))
                                ? "n"
                                : ""))},${sent});`
                        : this.sendFunction +
                            `(__$DISCORD_DATA$__.message.channelId,${sent});`}`;
                }
                else {
                    return "";
                }
            })()}`).replaceAll(TranspilerCustoms.SL, "\\`");
    }
    getFunction(sendMessage = true, execute = false) {
        const name = this.name === "global" ? "main" : this.name;
        return (`async function ${name}(__$DISCORD_DATA$__) {\n${this.toString(sendMessage)}\n}` +
            (execute
                ? `\n${this.addReturn ? "return " : ""}${name}(__$DISCORD_DATA$__);`
                : "")).replaceAll(TranspilerCustoms.SL, "`");
    }
    editMessage(channel, message) {
        const sendData = { ...this.sendData };
        sendData.embeds = escapeResult(escapeVars(`${this.name}_embeds`));
        sendData.components = escapeResult(escapeVars(`${this.name}_components`));
        sendData.files = escapeResult(escapeVars(`${this.name}_files`));
        sendData.content = sendData.content.replaceAll("\n", TranspilerCustoms.NL);
        if (sendData.content.replaceAll(TranspilerCustoms.NL, "").trim() !==
            "" ||
            this.embeds.length ||
            this.files.length ||
            this.stickers.length)
            this.hasSendData = true;
        else
            this.hasSendData = false;
        let parsedStr = parseString(sendData.content.replaceAll(TranspilerCustoms.NL, "\n").trim());
        parsedStr = parsedStr.trim() === "" ? " " : parsedStr.trim();
        this.rest = this.replaceLast(this.rest.trim(), this.sendData.content.trim(), "");
        const sent = `{
  content: ${parsedStr.replaceAll("\\n", TranspilerCustoms.NL)},
  embeds: ${escapeVars(`${this.name}_embeds`)},
  components: ${escapeVars(`${this.name}_components`)},
  files: ${escapeVars(`${this.name}_files`)},
  stickers: ${escapeVars(`${this.name}_stickers`)},
    }`.replaceAll(TranspilerCustoms.NL, "\\\\n");
        return parseResult(`async function ${this.name === "global" ? "main" : this.name}(__$DISCORD_DATA$__) {\n` +
            `const ${escapeVars(`${this.name}_embeds`)} = [];\n` +
            `const ${escapeVars(`${this.name}_components`)} = [];\n` +
            `const ${escapeVars(`${this.name}_files`)} = [];\n` +
            `const ${escapeVars(`${this.name}_stickers`)} = [];\n` +
            `${this.packages}` +
            `${this.setters}\n\n${this.functions}\n\n${this.rest.trim()}\n\n`.trim() +
            `\n${(() => {
                if (this.hasSendData) {
                    return `${this.addReturn ? "return " : ""} await ${`__$DISCORD_DATA$__.client.editMessage(${parseString(channel)},${parseString(message)},${sent}).catch(e => {
              throw e;
            });`}`;
                }
                else {
                    return "";
                }
            })()}` +
            "\n}").replaceAll(TranspilerCustoms.SL, "\\`");
    }
    update(res, data) {
        if (data.type === "function") {
            this.rest = this.rest.replace(data.total.replaceAll(TranspilerCustoms.FSEP, ";"), res);
        }
        else if (data.type === "setter") {
            this.setters += res + "\n";
            this.rest = this.rest.replace(removeSetFunc(data.total).replaceAll(TranspilerCustoms.FSEP, ";"), "");
        }
        else if (data.type === "function_getter") {
            this.rest = this.rest.replace(data.total.replaceAll(TranspilerCustoms.FSEP, ";"), res);
        }
        else if (data.type === "getter") {
            this.rest = this.rest.replace(data.total.replaceAll(TranspilerCustoms.FSEP, ";"), res);
        }
        else if (data.type === "scope" || data.type === "scope_getter") {
            this.rest = this.rest.replace(data.total.replaceAll(TranspilerCustoms.FSEP, ";"), res);
            data.funcs = [];
        }
    }
    rawString() {
        const sendData = { ...this.sendData };
        sendData.embeds = escapeResult(escapeVars(`${this.name}_embeds`));
        sendData.components = escapeResult(escapeVars(`${this.name}_components`));
        sendData.files = escapeResult(escapeVars(`${this.name}_files`));
        sendData.stickers = escapeResult(escapeVars(`${this.name}_stickers`));
        sendData.content = sendData.content.replaceAll("\n", TranspilerCustoms.NL);
        if (sendData.content.replaceAll(TranspilerCustoms.NL, "").trim() !==
            "" ||
            this.embeds.length ||
            this.files.length ||
            this.stickers.length)
            this.hasSendData = true;
        else
            this.hasSendData = false;
        return parseResult(`\n\n${this.rest.trim()}\n\n`.trim()).replaceAll(TranspilerCustoms.SL, "\\`");
    }
}
//# sourceMappingURL=Scope.js.map