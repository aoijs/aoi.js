const fs = require("fs");
const { CommandManager } = require("./Commands.js");
const PATH = require("path");
const chalk = require("chalk");
const AoiError = require("./AoiError");

class LoadCommands {
    constructor(client, addClassInClient = true) {
        this.client = client;
        this.paths = [];
        this.colors = {};
        if (addClassInClient) {
            this.client.loader = this;
        }
    }

    get allColors() {
        return {
            reset: chalk.reset,
            bright: chalk.bold,
            dim: chalk.dim,
            underscore: chalk.underline,
            blink: chalk.blink,
            reverse: chalk.inverse,
            hidden: chalk.hidden,

            fgBlack: chalk.black,
            fgRed: chalk.red,
            fgGreen: chalk.green,
            fgYellow: chalk.yellow,
            fgBlue: chalk.blue,
            fgMagenta: chalk.magenta,
            fgCyan: chalk.cyan,
            fgWhite: chalk.white,
            fgGray: chalk.gray,

            bgBlack: chalk.bgBlack,
            bgGray: chalk.bgGray,
            bgRed: chalk.bgRed,
            bgGreen: chalk.bgGreen,
            bgYellow: chalk.bgYellow,
            bgBlue: chalk.bgBlue,
            bgMagenta: chalk.bgMagenta,
            bgCyan: chalk.bgCyan,
            bgWhite: chalk.bgWhite
        };
    }

    get themes() {
        return {
            default: {
                loading: [chalk.blink, chalk.dim, chalk.white],
                failedLoading: {
                    name: [chalk.bold.yellow, chalk.underline],
                    text: [chalk.bold.red]
                },
                typeError: {
                    command: [chalk.bold.yellow],
                    type: [chalk.yellow],
                    text: [chalk.bold.red]
                },
                failLoad: {
                    command: [chalk.bold.magenta],
                    type: [chalk.red],
                    text: [chalk.bold.red]
                },
                loaded: {
                    command: [chalk.bold.cyan],
                    type: [chalk.bold.blue],
                    text: [chalk.bold.green]
                }
            },
            diff: {
                loading: [chalk.green],
                failedLoading: {
                    text: [chalk.red],
                    name: [chalk.bold.red]
                },
                typeError: {
                    command: [chalk.bold.red],
                    type: [chalk.red],
                    text: [chalk.dim.red]
                },
                failLoad: {
                    command: [chalk.bold.red],
                    type: [chalk.red],
                    text: [chalk.dim.red]
                },
                loaded: {
                    command: [chalk.bold.cyan],
                    type: [chalk.cyan],
                    text: [chalk.dim.cyan]
                }
            }
        };
    }

    logMessage(message, color) {
        console.log(color ? color(message) : message);
    }

    async load(client, path, debug = true) {
        const isObject = (data) => data instanceof Object && !Buffer.isBuffer(data) && !Array.isArray(data) && !(data instanceof RegExp);

        const walk = async (file) => {
            const something = await fs.promises.readdir(file, { withFileTypes: true }).then((f) =>
                f.map((d) => {
                    d.name = `${file}${PATH.sep}${d.name}`;
                    return d;
                })
            );

            const files = something.filter((d) => d.isFile());
            const dirs = something.filter((d) => d.isDirectory());

            for (const d of dirs) {
                const items = await walk(d.name);
                files.push(...items);
            }

            return files;
        };

        if (typeof path !== "string") {
            throw new TypeError(`Expecting typeof string on 'path' parameter, got '${typeof path}' instead`);
        }

        if (!PATH.isAbsolute(path)) path = PATH.resolve(path);

        try {
            const stats = await fs.promises.stat(path);
            if (!stats.isDirectory()) {
                throw new TypeError("Path is not a valid directory!");
            }
        } catch (e) {
            throw new TypeError(`Path is not a valid directory! ErrorMessage: ${e}`);
        }

        const index = this.paths.findIndex((d) => d.path === path);

        if (index < 0) {
            this.paths.push({
                path,
                debug,
                commandsLocation: client,
                keys: client instanceof CommandManager ? client.types : Object.keys(client)
            });
        }

        const validCmds = Object.getOwnPropertyNames(client);
        const dirents = await walk(path);
        let debugs = [];

        for (const { name } of dirents) {
            delete require.cache[name];

            let cmds;

            try {
                cmds = require(name);
            } catch {
                debugs.push(`${chalk.red("✖ Failed to load")} ${name}`);
                debugs.push("- " + name.split(PATH.sep).slice(-2).join(PATH.sep));
                continue;
            }

            if (cmds == null) {
                debugs.push(`${chalk.red("✖ No data provided in")} ${name}`);
                debugs.push("- " + name.split(PATH.sep).slice(-2).join(PATH.sep));
                continue;
            }

            if (!Array.isArray(cmds)) cmds = [cmds];

            for (const cmd of cmds) {
                const path = name.split(PATH.sep);
                const pathName = path.length > 2 ? path.slice(-3).join(PATH.sep) : name;

                if (!isObject(cmd)) {
                    const debugMessage = `${chalk.red("✖ Provided data is not an object in")} ${pathName}`;
                    debugs.push(debugMessage);
                    continue;
                }

                if (!("type" in cmd)) cmd.type = "default";

                const valid = validCmds.includes(cmd.type);

                if (!valid) {
                    const debugMessage = `${chalk.red("✖ Invalid Type Provided For")} '${cmd.name || cmd.channel}' ${chalk.gray(`(${cmd.type})`)} ${chalk.red("in")} '${pathName}'`;
                    debugs.push(debugMessage);
                    continue;
                }

                cmd.load = true;
                cmd.__path__ = name.split(PATH.sep).slice(-2).join(PATH.sep);

                try {
                    if (client instanceof CommandManager) {
                        client.createCommand(cmd);
                    } else {
                        client[cmd.type].set(client[cmd.type].size, cmd);
                    }
                } catch (e) {
                    console.error(e);
                    const debugMessage = `${chalk.red("✖ Failed to load")} '${cmd.name || cmd.channel}' ${chalk.gray(`(${cmd.type})`)} ${chalk.red("in")} '${pathName}'`;
                    debugs.push(debugMessage);
                    continue;
                }

                const debugMessage = `${chalk.green("✔ Loaded")} '${cmd.name || cmd.channel}' ${chalk.gray(`(${cmd.type})`)}`;
                debugs.push(debugMessage);
            }
        }

        if (debug) {
            AoiError.createConsoleMessage(
                [
                    ...debugs.map((debug) => ({
                        text: debug,
                        centered: false
                    }))
                ],
                "white",
                { text: "LoadCommands", textColor: "cyan" }
            );
        }
    }

    async update(debug = true) {
        for (const dp of this.paths) {
            for (const cmd of dp.keys) {
                try {
                    if (cmd === "interaction") {
                            dp.commandsLocation.interaction.slash = dp.commandsLocation.interaction.slash.filter((x) => !x.load);
                            dp.commandsLocation.interaction.button = dp.commandsLocation.interaction.button.filter((x) => !x.load);
                            dp.commandsLocation.interaction.selectMenu = dp.commandsLocation.interaction.selectMenu.filter((x) => !x.load);
                            dp.commandsLocation.interaction.modal = dp.commandsLocation.interaction.modal.filter((x) => !x.load);	
                    } else {
                            dp.commandsLocation[cmd] = dp.commandsLocation[cmd].filter((x) => !x.load);
                    }
                    if (cmd.loopInterval) {
                        clearInterval(cmd.loopInterval);
                    }
                } catch (e) {
                    throw new TypeError("Something went wrong, please check the error message: " + e);
                }
            }
            await this.load(dp.commandsLocation, dp.path, debug);
        }
    }

    setColors(c = { failLoad: null, loading: null, failedLoading: null, loaded: null, typeError: null, noData: null }) {
        for (const co of Object.keys(c)) {
            if (Array.isArray(c[co])) {
                this.colors[co] = c[co].map((x) => this.allColors[x]).join(" ");
            } else if (typeof c[co] === "object" && !Array.isArray(c[co])) {
                this.colors[co] = {};
                for (const coo of Object.keys(c[co])) {
                    if (Array.isArray(c[co][coo])) {
                        this.colors[co][coo] = c[co][coo].map((x) => this.allColors[x]).join(" ");
                    } else {
                        this.colors[co][coo] = c[co][coo];
                    }
                }
            } else {
                this.colors[co] = this.allColors[c[co]];
            }
        }
    }
}

module.exports = LoadCommands;
