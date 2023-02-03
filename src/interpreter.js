const Discord = require("discord.js");
const {CustomFunction} = require("./classes/Functions.js");
const AoiError = require("./classes/AoiError.js");
const Util = require("./classes/Util.js");
const IF = require("./utils/helpers/if.js");
//Helper of aoijs
const {Time} = require("./utils/helpers/customParser.js");
const {CheckCondition} = require("./utils/helpers/checkCondition.js");
const {mustEscape} = require("./utils/helpers/mustEscape.js");
const {Command} = require("./classes/Commands.js");
const PATH = require("path");
/**
 * @param  {import('./classes/AoiClient.js')} client
 * @param  {Discord.Message | {
 * message?:Discord.Message,
 * channel?:Discord.PartialDMChannel | Discord.DMChannel | Discord.TextChannel | Discord.NewsChannel | Discord.ThreadChannel,
 * guild?:Discord.Guild | null,
 * author?:Discord.User,
 * member?:Discord.GuildMember,
 * mentions?:Discord.MessageMentions }} message
 * @param  {string[]} args
 * @param  {Command | object } command
 * @param  {string} _db db to be used (deprecated param)
 * @param  {boolean} returnCode=false
 * @param  {string | void} channelUsed
 * @param  {object} data={}
 * @param  {Discord.TextChannel} useChannel
 * @param  {boolean} returnMessage
 * @param  {boolean} returnExecution
 * @param  {boolean} returnID
 * @param  {boolean} sendMessage=false
 */
const Interpreter = async (
    client,
    message,
    args,
    command,
    _db,
    returnCode = false,
    channelUsed,
    data = {},
    useChannel,
    returnMessage,
    returnExecution,
    returnID,
    sendMessage = false,
) => {
    try {
        //defining vars//
        let code = command.code
            ?.replaceAll("\\]", "#LEFT#")
            .split("\\[")
            .join("#RIGHT#")
            .replaceAll("\\,", "#COMMA#")
            .replaceAll("\\;", "#SEMI#");

        let [
            randoms,
            timezone,
            letVars,
            object,
            disableMentions,
            array,
            arrays,
            reactions,
            channel,
            author,
            guild,
            mentions,
            member,
            msg,
        ] = [
            data.randoms || {},
            "UTC",
            data.vars || {},
            data.object || {},
            ["roles", "users", "everyone"],
            data.array || [],
            data.arrays || [],
            [],
            message.channel,
            message.author,
            message.guild,
            message.mentions,
            message.member,
            message,
        ];
        let errorOccurred;
        let embeds;
        let deleteIn;
        let suppressErrors;
        let editIn = undefined;
        let error;
        let attachments = [];
        let components = [];
        let reply;
        let allowedMentions = disableMentions;
        let FuncData;
        let msgobj;
        let funcLine;
        let returnData = {};
        command.codeLines =
            command.codeLines || client.functionManager.serializeCode(command.code);
        let funcs = command.functions?.length
            ? command.functions
            : client.functionManager.findFunctions(command.code);
        command.__path__ = PATH.sep + command.name + ".js";
        //   debug system
        const debug = {
            code,
            functions: command.functions,
        };
        if (command["$if"] === "old") {
            code = (
                await IF({
                    client,
                    code,
                    message,
                    channel,
                    args,
                    data: {
                        randoms: randoms,
                        command: {
                            name: command.name,
                            code: code,
                            error: command.error,
                            async: command.async || false,
                            functions: command.functions,
                            __path__: command.__path__,
                            codeLines: command.codeLines,
                        },
                        helpers: {
                            time: Time,
                            checkCondition: CheckCondition,
                            mustEscape,
                        },
                        args: args,
                        aoiError: require("./classes/AoiError.js"),
                        data: data,
                        func: undefined,
                        funcLine: undefined,
                        util: Util,
                        allowedMentions: allowedMentions,
                        embeds: embeds || [],
                        components: components,
                        files: attachments || [],
                        timezone: timezone,
                        channelUsed: channelUsed,
                        vars: letVars,
                        object: object,
                        disableMentions: disableMentions,
                        returnID: returnID,
                        array: array,
                        arrays,
                        reactions: reactions,
                        message: message.message || message,
                        msg: msg.message || msg,
                        author: author,
                        guild: guild,
                        channel: channel,
                        member: member,
                        mentions: mentions,
                        unpack() {
                            const last =
                                code.split(this.func.replace("[", "")).length -
                                1;
                            const sliced = code.split(
                                this.func.replace("[", ""),
                            )[last];

                            return sliced.after();
                        },
                        inside(unpacked) {
                            if (typeof unpacked.inside !== "string") {
                                if (suppressErrors) return suppressErrors;
                                else {
                                    return client.aoiOptions.suppressAllErrors
                                        ? client.aoiOptions.errorMessage
                                        : `\`AoiError: ${this.func}: Invalid Usage (line : ${funcLine})\``;
                                }
                            } else return false;
                        },
                        noop() {
                        },
                        interpreter: Interpreter,
                        client: client,
                        embed: Discord.EmbedBuilder,
                    },
                })
            ).code;
            funcs = client.functionManager.findFunctions(code);
        }
        //parsing functions (dont touch)
        for (let i = funcs.length; i > 0; i--) {
            if (!funcs.length) break;

            if (i > funcs.length && funcs.length !== 0) i = funcs.length;

            let func = funcs[i - 1];

            if (error) break;
            const regex = new RegExp("\\" + func.replace("[", "\\["), "gi");

            code = code.replace(regex, func);
            //more debug
            debug[func] = {regex, func};
            command.codeLines?.map((x) => x.replace(regex, func));
            funcLine =
                command.codeLines.length -
                command.codeLines
                    ?.reverse()
                    .findIndex((x) =>
                        x.toLowerCase().split(" ").includes(func.toLowerCase()),
                    );

            const functionObj = client.functionManager.cache.get(
                func.replace("$", "").replace("[", ""),
            );
            if (
                functionObj instanceof CustomFunction &&
                functionObj.type === "aoi.js"
            ) {
                const d = {};
                Object.assign(d, functionObj);
                let param = [];
                for (let p = functionObj.params.length - 1; p >= 0; p--) {
                    d.code = d.code.replace(
                        `{${functionObj.params[p]}}`,
                        unpack(code, func).splits[p],
                    );
                    param.push(functionObj.params[p]);
                }
                FuncData = await client.functionManager.interpreter(
                    client,
                    message,
                    args,
                    d,
                    client.db,
                    true,
                    channelUsed,
                    {
                        randoms: randoms,
                        command: {
                            name: command.name,
                            code: code,
                            error: command.error,
                            async: command.async || false,
                            functions: command.functions,
                            __path__: command.__path__,
                            codeLines: command.codeLines,
                            funcLine: funcLine
                        },
                        helpers: {
                            time: Time,
                            checkCondition: CheckCondition,
                            mustEscape,
                        },
                        args: args,
                        aoiError: require("./classes/AoiError.js"),
                        data: data,
                        func: func,
                        funcLine,
                        util: Util,
                        allowedMentions: allowedMentions,
                        embeds: embeds || [],
                        components: components,
                        files: attachments || [],
                        timezone: timezone,
                        channelUsed: channelUsed,
                        vars: letVars,
                        object: object,
                        disableMentions: disableMentions,
                        returnID: returnID,
                        array: array,
                        arrays,
                        reactions: reactions,
                        message: message.message || message,
                        msg: msg.message || msg,
                        author: author,
                        guild: guild,
                        channel: channel,
                        member: member,
                        mentions: mentions,
                        unpack() {
                            const last = code.split(func.replace("[", "")).length - 1;
                            const sliced = code.split(func.replace("[", ""))[last];

                            return sliced.after();
                        },
                        inside(unpacked) {
                            if (typeof unpacked.inside !== "string") {
                                if (suppressErrors) return suppressErrors;
                                else {
                                    return client.aoiOptions.suppressAllErrors
                                        ? client.aoiOptions.errorMessage
                                        : `\`AoiError: ${func}: Invalid Usage (line : ${funcLine})\``;
                                }
                            } else return false;
                        },
                        noop() {
                        },
                        interpreter: Interpreter,
                        client: client,
                        embed: Discord.EmbedBuilder,
                    },
                    useChannel,
                    returnMessage,
                    returnExecution,
                    returnID,
                    sendMessage,
                );
                FuncData.code = code.replaceLast(
                    functionObj.params.length ? `${func}${param.join(";")}` : func,
                    FuncData.code,
                );
            } else {
                FuncData = await client.functionManager.cache
                    .get(func.replace("$", "").replace("[", ""))
                    ?.code({
                        randoms: randoms,
                        command: {
                            name: command.name,
                            code: code,
                            error: command.error,
                            async: command.async || false,
                            functions: command.functions,
                            __path__: command.__path__,
                            codeLines: command.codeLines,
                            funcLine: funcLine
                        },
                        helpers: {
                            time: Time,
                            checkCondition: CheckCondition,
                            mustEscape,
                        },
                        args: args,
                        aoiError: require("./classes/AoiError.js"),
                        data: data,
                        func: func,
                        funcLine,
                        util: Util,
                        allowedMentions: allowedMentions,
                        embeds: embeds || [],
                        components: components,
                        files: attachments || [],
                        timezone: timezone,
                        channelUsed: channelUsed,
                        vars: letVars,
                        object: object,
                        disableMentions: disableMentions,
                        array: array,
                        arrays,
                        reactions: reactions,
                        message: message.message || message,
                        msg: msg.message || msg,
                        author: author,
                        guild: guild,
                        channel: channel,
                        member: member,
                        mentions: mentions, //cleanup (ignore)
                        unpack() {
                            const last = code.split(func.replace("[", "")).length - 1;
                            const sliced = code.split(func.replace("[", ""))[last];

                            return sliced.after();
                        },
                        inside(unpacked) {
                            if (typeof unpacked.inside !== "string") {
                                if (suppressErrors) return suppressErrors;
                                else {
                                    return client.aoiOptions.suppressAllErrors
                                        ? client.aoiOptions.errorMessage
                                        : `\`AoiError: ${func}: Invalid Usage (line : ${funcLine})\``;
                                }
                            } else return false;
                        },
                        noop() {
                        },
                        async error(err) {
                            error = true;
                            client.emit(
                                "functionError",
                                {
                                    error: err?.addBrackets(),
                                    function: func,
                                    command: command.name,
                                    channel,
                                    guild,
                                },
                                client,
                            );
                            if (client.aoiOptions.suppressAllErrors) {
                                if (client.aoiOptions.errorMessage) {
                                    const {
                                        EmbedParser,
                                        FileParser,
                                        ComponentParser,
                                    } = Util.parsers;

                                    if (!message || !message.channel) {
                                        console.error(client.aoiOptions.errorMessage.addBrackets());
                                    } else {
                                        let [con, em, com, fil] = [" ", "", "", ""];
                                        let isArray = Array.isArray(client.aoiOptions.errorMessage);
                                        if (isArray) {
                                            isArray = client.aoiOptions.errorMessage;
                                            con = isArray[0] === "" || !isArray[0] ? " " : isArray[0];
                                            em =
                                                isArray[1] !== "" && isArray[1]
                                                    ? await EmbedParser(isArray[1] || "")
                                                    : [];
                                            fil =
                                                isArray[3] !== "" && isArray[3]
                                                    ? FileParser(isArray[3] || "")
                                                    : [];
                                            com =
                                                isArray[2] !== "" && isArray[2]
                                                    ? await ComponentParser(isArray[2] || "")
                                                    : [];
                                        } else {
                                            con =
                                                client.aoiOptions.errorMessage.addBrackets() === ""
                                                    ? " "
                                                    : client.aoiOptions.errorMessage.addBrackets();
                                        }

                                        if (!errorOccurred) {
                                            await message.channel.send({
                                                content: con,
                                                embeds: em || [],
                                                components: com || [],
                                                files: fil || [],
                                            });
                                        }
                                        errorOccurred = true;
                                    }
                                }
                            } else {
                                if (!message || !message.channel) {
                                    console.error(err.addBrackets());
                                }
                                else if (suppressErrors && !errorOccurred) {
                                    if (suppressErrors.trim() !== "") {
                                        const {makeMessageError} = require("./classes/AoiError.js")
                                        const msg =
                                            await Util.errorParser(
                                                suppressErrors?.split("{error}").join(err.addBrackets()),
                                                {
                                                    channel: channel,
                                                    message: message,
                                                    guild: guild,
                                                    author: author,
                                                });
                                        await makeMessageError(
                                            client,
                                            channel,
                                            msg.data ?? msg,
                                            msg.aoiOptions,
                                            {
                                                channel: channel,
                                                message: message,
                                                guild: guild,
                                                author: author,
                                                data: data
                                            }
                                        )
                                    } 
                                } else {
                                    await message.channel.send(
                                        typeof err === "object" ? err : err?.addBrackets(),
                                    );
                                }
                                errorOccurred = true;
                            }
                        },
                        interpreter: Interpreter,
                        client: client,
                        embed: Discord.EmbedBuilder,
                    });
            }

            code = FuncData?.code ?? code;

            if (FuncData?.randoms) {
                randoms = FuncData.randoms;
            }
            if (FuncData?.data) {
                data = FuncData.data;
                array = FuncData.data?.array ?? array;
                arrays = FuncData.data?.arrays ?? arrays;
                object = FuncData?.data?.object ?? object;
                letVars = FuncData?.data?.vars ?? letVars;
            }
            if (FuncData?.timezone) {
                timezone = FuncData.timezone;
            }
            if (FuncData?.allowedMentions) {
                allowedMentions = FuncData.allowedMentions;
            }
            if (FuncData?.embeds) {
                embeds = FuncData.embeds;
            }
            if (FuncData?.reactions) {
                reactions = FuncData.reactions;
            }
            if (FuncData?.disableMentions) {
                disableMentions = FuncData.disableMentions;
            }
            if (FuncData?.editIn) {
                editIn = FuncData.editIn;
            }
            if (FuncData?.deleteIn) {
                deleteIn = FuncData.deleteIn;
            }
            if (FuncData?.files) {
                attachments = FuncData.files;
            }
            if (FuncData?.suppressErrors) {
                suppressErrors = FuncData.suppressErrors;
            }
            if (FuncData?.components) {
                components = FuncData.components;
            }
            if (FuncData?.reply) {
                reply = FuncData.reply;
            }
            if (FuncData?.useChannel) {
                useChannel = FuncData.useChannel;
            }
            if (FuncData?.returnID) {
                returnID = FuncData.returnID;
            }
            if (FuncData?.error) {
                error = FuncData?.error;
            }
            if (FuncData?.arrays) {
                arrays = FuncData?.arrays;
            }
        }
        const start = performance.now();
        const ended = (performance.now() - start).toFixed(3);
        embeds = JSON.parse(
            JSON.stringify(embeds || [])?.replaceAll("$executionTime", ended),
        );

        debug.executionTime = ended + " ms";
        code = code?.replace(/\$executiontime/gi, ended);

        code = code.trim();
        if (embeds?.some((x) => x === undefined)) {
            error = true;
            return AoiError.consoleError("EmbedError", "Index are not defined.");
        }
        if (returnCode) {
            returnData.code = code;
        }
        if (returnExecution) {
            returnData.data = data;
        }
        if (
            (code.length || embeds?.length || attachments?.length) &&
            !errorOccurred &&
            !error
        ) {
            try {
                const send = {
                    embeds: embeds,
                    files: attachments,
                    components: components,
                    allowedMentions: {
                        parse: allowedMentions,
                        repliedUser: reply?.user || false,
                    },
                    reply: {
                        messageReference: reply?.message,
                    },
                };
                if (code.trim() !== "") {
                    send.content = code.addBrackets() === "" ? " " : code.addBrackets();
                }
                if (returnCode && !sendMessage) {
                } else {
                    if (!useChannel) {
                        msgobj = await message.channel?.send(send);
                    } else {
                        msgobj = await useChannel.send(send);
                    }
                }
                if (reactions?.length) {
                    const react = setInterval(() => {
                        const r = reactions.shift();
                        msgobj.react(r);
                        if (!reactions.length) {
                            clearInterval(react);
                        }
                    }, 1500);
                }
                if (editIn) {
                    const ee = setInterval(() => {
                        const m = editIn.msgs;
                        msgobj.edit(m.shift());
                        if (!m.length) {
                            clearInterval(ee);
                        }
                    }, editIn.time);
                }
                if (deleteIn) {
                    setTimeout(() => msgobj.delete(), deleteIn);
                }

                if (returnID) {
                    returnData.id = msgobj?.id;
                }
                if (returnMessage) {
                    returnData.message = msgobj;
                }
            } catch (e) {
                console.error(e);
            }
        }
        return Object.keys(returnData).length ? returnData : undefined;
    } catch (e) {
        console.error(e);
    }
};
module.exports = Interpreter;

function unpack(code, func) {
    const last = code.split(func.replace("[", "")).length - 1;
    const sliced = code.split(func.replace("[", ""))[last];
    return sliced.after();
}