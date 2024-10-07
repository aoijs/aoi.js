const Discord = require("discord.js");
const { CustomFunction } = require("../classes/Functions.js");
const AoiError = require("../classes/AoiError.js");
const Util = require("../classes/Util.js");
const IF = require("./if.js");
const { Time } = require("./Time.js");
const { CheckCondition } = require("./CheckCondition.js");
const { mustEscape } = require("./mustEscape.js");
const { Command } = require("../classes/Commands.js");
const PATH = require("path");

/**
 * Description
 * @param {string[]} functionList
 * @param {import('../classes/AoiClient.js')} client
 * @returns {boolean}
 */
function hasAoijsCustomFunction(functionList, client) {
    const allAoijsCustomFunctions = client.functionManager.cache.filter((x) => x instanceof CustomFunction && x.type === "aoi.js");
    return allAoijsCustomFunctions.some((_, x) => functionList.some((y) => y === "$" + x));
}

/**
 * @param  {import('../classes/AoiClient.js')} client
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
const Interpreter = async (client, message, args, command, _db, returnCode = false, channelUsed, data = {}, useChannel, returnMessage, returnExecution, returnID, sendMessage = false) => {
    try {
        const start = performance.now();
        if (client?.aoiOptions?.debugs?.interpreter) {
            console.time(`interpreter-${start}`);
        }
        //defining vars//
        let code = command.code?.replaceAll("\\]", "#LEFT#").split("\\[").join("#RIGHT#").replaceAll("\\,", "#COMMA#").replaceAll("\\;", "#SEMI#");

        let [randoms, timezone, letVars, object, disableMentions, array, arrays, reactions, channel, author, guild, mentions, member, msg] = [
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
            message
        ];
        let errorOccurred;
        let embeds;
        let deleteIn;
        let suppressErrors;
        let flags;
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
        command.codeLines = command.codeLines || client.functionManager.serializeCode(command.code);
        let funcs = command.functions?.length ? command.functions : client.functionManager.findFunctions(command.code);
        command.__path__ = PATH.sep + command.name + ".js";
        //   debug system
        const debug = {
            code,
            functions: command.functions
        };

        // get all aoi.js type custom function
        while (hasAoijsCustomFunction(funcs, client)) {
            let hadCustomAoijsFunction = false;
            for (const func of funcs) {
                const regex = new RegExp("\\" + func.replace("[", "\\["), "gi");

                code = code.replace(regex, func);
                const codeData = client.functionManager.cache.get(func.replace("$", ""));
                if (codeData instanceof CustomFunction && codeData.type === "aoi.js") {
                    const d = {};
                    Object.assign(d, codeData);
                    let param = [];
                    const unpacked = unpack(code, func);

                    if (!unpacked.inside && codeData.params.length) {
                        throw new Error(`${func} needs params, provided none`);
                    }
                    for (let p = codeData.params.length - 1; p >= 0; p--) {
                        d.code = d.code.replace(`{${codeData.params[p]}}`, unpacked.splits[p]);
                        param.push(unpacked.splits[p]);
                    }
                    param.reverse();

                    hadCustomAoijsFunction = true;
                    code = code.replaceLast(codeData.params.length ? `${func}[${param.join(";")}]` : func, d.code);
                }
            }
            if (hadCustomAoijsFunction) {
                funcs = client.functionManager.findFunctions(code);
                command.functions = funcs;
                command.code = code;
            }
        }

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
                            type: command.type,
                            code: code,
                            error: command.error,
                            async: command.async || false,
                            functions: command.functions,
                            __path__: command.__path__,
                            codeLines: command.codeLines
                        },
                        helpers: {
                            time: Time,
                            checkCondition: CheckCondition,
                            mustEscape
                        },
                        args: args,
                        aoiError: require("../classes/AoiError.js"),
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
                            const last = code.split(this.func.replace("[", "")).length - 1;
                            const sliced = code.split(this.func.replace("[", ""))[last];

                            return sliced.after();
                        },
                        inside(unpacked) {
                            if (typeof unpacked.inside !== "string") {
                                if (suppressErrors) return suppressErrors;
                                else {
                                    return client.aoiOptions.suppressAllErrors ? client.aoiOptions.errorMessage : `AoiError: ${this.func}: Missing Brackets`;
                                }
                            } else return false;
                        },
                        noop() {},
                        interpreter: Interpreter,
                        client: client,
                        embed: Discord.EmbedBuilder
                    }
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
            debug[func] = { regex, func };
            command.codeLines?.map((x) => x.replace(regex, func));
            funcLine = command.codeLines.length - command.codeLines?.reverse().findIndex((x) => x.toLowerCase().split(" ").includes(func.toLowerCase()));

            const functionObj = client.functionManager.cache.get(func.replace("$", "").replace("[", ""));
            // if (functionObj instanceof CustomFunction && functionObj.type === "aoi.js") {
            //     const d = {};
            //     Object.assign(d, functionObj);
            //     let param = [];
            //     for (let p = functionObj.params.length - 1; p >= 0; p--) {
            //         d.code = d.code.replace(`{${functionObj.params[p]}}`, unpack(code, func).splits[p]);
            //         param.push(functionObj.params[p]);
            //     }
            //     FuncData = await client.functionManager.interpreter(
            //         client,
            //         message,
            //         args,
            //         d,
            //         client.db,
            //         true,
            //         channelUsed,
            //         {
            //             randoms: randoms,
            //             command: {
            //                 name: command.name,
            //                 type: command.type,
            //                 code: code,
            //                 error: command.error,
            //                 async: command.async || false,
            //                 functions: command.functions,
            //                 __path__: command.__path__,
            //                 codeLines: command.codeLines,
            //                 funcLine: funcLine
            //             },
            //             helpers: {
            //                 time: Time,
            //                 checkCondition: CheckCondition,
            //                 mustEscape
            //             },
            //             args: args,
            //             aoiError: require("../classes/AoiError.js"),
            //             data: data,
            //             func: func,
            //             funcLine,
            //             util: Util,
            //             allowedMentions: allowedMentions,
            //             embeds: embeds || [],
            //             components: components,
            //             files: attachments || [],
            //             timezone: timezone,
            //             channelUsed: channelUsed,
            //             vars: letVars,
            //             object: object,
            //             disableMentions: disableMentions,
            //             returnID: returnID,
            //             array: array,
            //             arrays,
            //             reactions: reactions,
            //             message: message.message || message,
            //             msg: msg.message || msg,
            //             author: author,
            //             guild: guild,
            //             channel: channel,
            //             member: member,
            //             mentions: mentions,
            //             unpack() {
            //                 const last = code.split(func.replace("[", "")).length - 1;
            //                 const sliced = code.split(func.replace("[", ""))[last];

            //                 return sliced.after();
            //             },
            //             inside(unpacked) {
            //                 if (typeof unpacked.inside !== "string") {
            //                     if (suppressErrors) return suppressErrors;
            //                     else {
            //                         return client.aoiOptions.suppressAllErrors ? client.aoiOptions.errorMessage : `AoiError: ${this.func}: Missing Brackets`;
            //                     }
            //                 } else return false;
            //             },
            //             noop() {},
            //             interpreter: Interpreter,
            //             client: client,
            //             embed: Discord.EmbedBuilder
            //         },
            //         useChannel,
            //         returnMessage,
            //         returnExecution,
            //         returnID,
            //         sendMessage
            //     );
            //     FuncData.code = code.replaceLast(functionObj.params.length ? `${func}${param.join(";")}` : func, FuncData.code);
            // } else {
            FuncData = await client.functionManager.cache.get(func.replace("$", "").replace("[", ""))?.code({
                randoms: randoms,
                command: {
                    name: command.name,
                    type: command.type,
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
                    mustEscape
                },
                args: args,
                aoiError: require("../classes/AoiError.js"),
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
                            return client.aoiOptions.suppressAllErrors ? client.aoiOptions.errorMessage : `AoiError: \`${this.func}\`: Missing Brackets`;
                        }
                    } else return false;
                },
                noop() {},
                async error(err, d) {
                    error = true;
                    client.emit(
                        "functionError",
                        {
                            error: err?.addBrackets(),
                            function: func,
                            command: command.name,
                            channel,
                            guild
                        },
                        client
                    );
                    if (client.aoiOptions.suppressAllErrors) {
                        if (client.aoiOptions.errorMessage) {
                            const msg = message;
                            if (!msg || !msg.channel) {
                                console.error(client.aoiOptions.errorMessage.addBrackets());
                            } else {
                                if (!errorOccurred) {
                                    try {
                                        await Interpreter(
                                            client,
                                            msg ?? data,
                                            args ?? [],
                                            { code: client.aoiOptions.errorMessage },
                                            client.db,
                                            false,
                                            msg.channel ?? [],
                                            {},
                                            msg.channel ?? [],
                                            false,
                                            false,
                                            false,
                                            true
                                        );
                                    } catch (e) {
                                        console.error(client.aoiOptions.errorMessage.addBrackets());
                                    }
                                    errorOccurred = true;
                                }
                            }
                        }
                    } else {
                        if (!message || !message.channel) {
                            console.error(err.addBrackets());
                        } else if (suppressErrors && !errorOccurred) {
                            if (suppressErrors.trim() !== "") {
                                const { makeMessageError } = require("../classes/AoiError.js");
                                const msg = await Util.errorParser(suppressErrors?.split("{error}").join(err.addBrackets()), {
                                    channel: channel,
                                    message: message,
                                    guild: guild,
                                    author: author
                                });
                                await makeMessageError(client, channel, msg.data ?? msg, msg.options, {
                                    channel: channel,
                                    message: message,
                                    guild: guild,
                                    author: author,
                                    data: data
                                });
                            }
                        } else {
                            await message.channel.send(typeof err === "object" ? err : err?.addBrackets());
                        }
                        errorOccurred = true;
                    }
                },
                interpreter: Interpreter,
                client: client,
                embed: Discord.EmbedBuilder
            });
            if (client?.aoiOptions?.debugs?.interpreter) {
                debug[func].funcData = require("util").inspect(FuncData, { depth: 0 });
            }
            // }

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
            if (FuncData?.flags) {
                flags = FuncData.flags;
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

        const ended = (performance.now() - start).toFixed(3);
        embeds = JSON.parse(JSON.stringify(embeds || [])?.replaceAll("$executionTime", ended));

        if (client?.aoiOptions?.debugs?.interpreter) {
            debug.executionTime = ended + " ms";
            console.timeEnd(`interpreter-${start}`);
        }

        debug.executionTime = ended + " ms";
        code = code?.replace(/\$executiontime/gi, ended);

        code = code.trim();
        if (embeds?.some((x) => x === undefined)) {
            error = true;
            return AoiError.consoleError("EmbedError", "Index are not defined.");
        }
        if (returnCode) {
            returnData.code = !error ? code : null;
        }
        if (returnExecution) {
            returnData.data = data;
        }

        if ((code.length || embeds?.length || attachments?.length) && !errorOccurred && !error) {
            try {
                const send = {
                    embeds: embeds,
                    files: attachments,
                    components: components,
                    flags,
                    allowedMentions: {
                        parse: allowedMentions,
                        repliedUser: reply?.user || false
                    },
                    reply: {
                        messageReference: reply?.message
                    }
                };
                if (code.trim() !== "" && !error) {
                    send.content = code.addBrackets() === "" ? " " : code.addBrackets();
                }
                if (returnCode && !sendMessage) {
                } else {
                    if (!useChannel) {
                        msgobj = await message.channel?.send(send)?.catch((e) => {
                            console.error(e);
                        });
                    } else {
                        msgobj = await useChannel?.send(send)?.catch((e) => {
                            console.error(e);
                        });
                    }
                }

                if (client?.aoiOptions?.debugs?.interpreter) {
                    console.log(debug);
                }

                if (reactions?.length) {
                    const react = setInterval(() => {
                        const r = reactions.shift();
                        msgobj.react(r).catch((e) => {
                            console.error(e);
                        });
                        if (!reactions.length) {
                            clearInterval(react);
                        }
                    }, 1e3);
                }
                if (editIn) {
                    const ee = setInterval(() => {
                        const m = editIn.msgs;
                        msgobj.edit(m.shift()).catch((e) => {
                            console.error(e);
                        });
                        if (!m.length) {
                            clearInterval(ee);
                        }
                    }, editIn.time);
                }
                if (deleteIn) {
                    setTimeout(
                        () =>
                            msgobj.delete().catch((e) => {
                                console.error(e);
                            }),
                        deleteIn
                    );
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
