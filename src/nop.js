const Discord = require("discord.js");
const { CustomFunction } = require("./classes/Functions.js");
const AoiError = require("./classes/AoiError.js");
const Util = require("./classes/Util.js");

//Helper of aoijs
const { Time } = require("./utils/helpers/customParser.js");
const { CheckCondition } = require("./utils/helpers/checkCondition.js");
const { mustEscape } = require("./utils/helpers/mustEscape.js");
const { Command } = require("./classes/Commands.js");
const { createFuncAST } = require("./utils/helpers/functions.js");
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
            command.codeLines ||
            client.functionManager.serializeCode(command.code);
        let funcs = command.functions?.length
            ? command.functions
            : client.functionManager.findFunctions(command.code);
        //debug system
        const debug = {
            code,
            functions: command.functions,
        };

        let d = {
            randoms: randoms,
            command: {
                name: command.name,
                code: code,
                error: command.error,
                async: command.async || false,
                functions: command.functions,
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
            noop() {},
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
                        } = require("./handler/parsers.js");

                        if (!message || !message.channel) {
                            console.error(
                                client.aoiOptions.errorMessage.addBrackets(),
                            );
                        } else {
                            let [con, em, com, fil] = [" ", "", "", ""];
                            let isArray = Array.isArray(
                                client.aoiOptions.errorMessage,
                            );
                            if (isArray) {
                                isArray = client.aoiOptions.errorMessage;
                                con =
                                    isArray[0] === "" || !isArray[0]
                                        ? " "
                                        : isArray[0];
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
                                        ? await ComponentParser(
                                              isArray[2] || "",
                                          )
                                        : [];
                            } else {
                                con =
                                    client.aoiOptions.errorMessage.addBrackets() ===
                                    ""
                                        ? " "
                                        : client.aoiOptions.errorMessage.addBrackets();
                            }

                            if (!errorOccurred) {
                                message.channel.send({
                                    content: con,
                                    embeds: em || [],
                                    components: com || [],
                                    files: fil || [],
                                });
                            }
                            errorOccurred = true;
                        }
                    } else;
                } else {
                    if (!message || !message.channel) {
                        console.error(err.addBrackets());
                    }
                    if (suppressErrors && !errorOccurred) {
                        if (suppressErrors.trim() !== "") {
                            const {
                                makeMessageError,
                            } = require("./classes/AoiError.js");
                            const msg = await Util.errorParser(
                                suppressErrors
                                    ?.split("{error}")
                                    .join(err.addBrackets()),
                                {
                                    channel: channel,
                                    message: message,
                                    guild: guild,
                                    author: author,
                                },
                            );
                            await makeMessageError(
                                client,
                                channel,
                                msg,
                                msg.aoiOptions,
                                {
                                    channel: channel,
                                    message: message,
                                    guild: guild,
                                    author: author,
                                    data: data,
                                },
                            );
                        } else;
                    } else {
                        message.channel.send(
                            typeof err === "object" ? err : err?.addBrackets(),
                        );
                    }
                    errorOccurred = true;
                }
            },
            interpreter: Interpreter,
            client: client,
            embed: Discord.EmbedBuilder,
        };
        const start = performance.now();
        const ast = createFuncAST(`$execMain[${code}]`)[0];
        const res = await ast.execute(
            client,
            message,
            args,
            d,
            client.aoiOptions.reverseReading ? "b" : "f",
        );
        const ended = (performance.now() - start).toFixed(3);
        code = res.code;
        d = res.data;
        embeds = res.embeds;
        components = res.components;
        attachments = res.files;
        returnData = res.returnData;
        allowedMentions = res.allowedMentions;
        FuncData = res;
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
        // all vars are updated
        code = code?.replace(/\$executiontime/gi, ended);

        code = code.trim();
        if (embeds?.some((x) => x === undefined)) {
            error = true;
            return AoiError.consoleError(
                "EmbedError",
                "Index are not defined.",
            );
        }
        console.log( code );
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
                    send.content =
                        code.addBrackets() === "" ? " " : code.addBrackets();
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
        return Object.keys(returnData ?? {}).length ? returnData : undefined;
    } catch (e) {
        console.error(e);
    }
};

module.exports = Interpreter;