const IF = async (d) => {
    const interpreter = require("./interpreter.js");
    let code = d.code;
    let message = d.message;
    let client = d.client;
    let args = d.args;
    const Data = d.data.data;

    if (code.toLowerCase().includes("$if[")) {
        for (let statement of code
            .split(/\$if\[/gi)
            .slice(1)
            .reverse()) {
            const r = code.toLowerCase().split("$if[").length - 1;

            if (!code.toLowerCase().includes("$endif")) return message.channel.send(`\`AoiError: $if: Invalid Usage: missing $endif\``);

            const everything = code.split(/\$if\[/gi)[r].split(/\$endif/gi)[0];

            statement = code.split(/\$if\[/gi)[r].split(/\$endif/gi)[0];

            let condition = statement.split("\n")[0].trim();

            condition = condition.slice(0, condition.length - 1);

            const pass =
                (
                    await interpreter(
                        client,
                        message,
                        args,
                        {
                            code: `$checkCondition[${condition}]`,
                            name: "check"
                        },
                        undefined,
                        true,
                        undefined,
                        Data
                    )
                )?.code === "true";

            const elseIfAction = statement.toLowerCase().includes("$elseif");

            const elseIfs = {};

            if (elseIfAction) {
                for (const data of statement.split(/\$elseif\[/gi).slice(1)) {
                    if (!data.toLowerCase().includes("$endelseif")) return message.channel.send(`\`AoiError: $elseIf: Invalid Usage: missing $endelseIf\``);

                    const inside = data.split(/\$endelseIf/gi)[0];

                    let CONDITION = inside.split("\n")[0].trim();

                    CONDITION = CONDITION.slice(0, CONDITION.length - 1);

                    elseIfs[CONDITION] = inside.split("\n").slice(1).join("\n");

                    function escapeRegExp(string) {
                        return string.replace(/[.*+?^${}()|[\]\\\n]/g, "\\$&");
                    }

                    statement = statement.replace(new RegExp(`\\$elseif\\[${escapeRegExp(inside)}\\$endelseif`, "mi"), "");
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

            const elseCode = elseAction ? statement.split(/\$else/gi)[1].split(/\$endif/gi)[0] : "";

            let passes = false;

            let lastCode;

            if (elseIfAction) {
                for (const data of Object.entries(elseIfs)) {
                    if (!passes) {
                        const response =
                            (
                                await interpreter(
                                    client,
                                    message,
                                    args,
                                    {
                                        code: `$checkCondition[${data[0]}]`,
                                        name: "check"
                                    },
                                    undefined,
                                    true,
                                    undefined,
                                    Data
                                )
                            )?.code === "true";

                        if (response) {
                            passes = true;
                            lastCode = data[1];
                        }
                    }
                }
            }

            code = code.replace(/\$if\[/gi, "$if[").replace(/\$endif/gi, "$endif");
            const result = (
                await interpreter(
                    client,
                    message,
                    args,
                    {
                        code: pass ? ifCode : passes ? lastCode : elseCode,
                        name: "executeStatement"
                    },
                    undefined,
                    true,
                    undefined,
                    Data
                )
            )?.code;
            code = code.replaceLast(`$if[${everything}$endif`, result);
        }
    }
    return { code };
};
module.exports = IF;
