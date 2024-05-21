const fs = require("fs");
const { CommandManager } = require("./Commands.js");
const PATH = require("path");
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
            reset: "\x1b[0m",
            bright: "\x1b[1m",
            dim: "\x1b[2m",
            underscore: "\x1b[4m",
            blink: "\x1b[5m",
            reverse: "\x1b[7m",
            hidden: "\x1b[8m",

            fgBlack: "\x1b[30m",
            fgRed: "\x1b[31m",
            fgGreen: "\x1b[32m",
            fgYellow: "\x1b[33m",
            fgBlue: "\x1b[34m",
            fgMagenta: "\x1b[35m",
            fgCyan: "\x1b[36m",
            fgWhite: "\x1b[37m",

            bgBlack: "\x1b[40m",
            bgRed: "\x1b[41m",
            bgGreen: "\x1b[42m",
            bgYellow: "\x1b[43m",
            bgBlue: "\x1b[44m",
            bgMagenta: "\x1b[45m",
            bgCyan: "\x1b[46m",
            bgWhite: "\x1b[47m",
        };
    }

    get themes() {
        return {
            default: {
                loading: ["blink", "dim", "fgWhite"],
                failedLoading: {
                    name: ["bright", "fgYellow", "underscore"],
                    text: ["bright", "fgRed"],
                },
                typeError: {
                    command: ["bright", "fgYellow"],
                    type: ["fgYellow"],
                    text: ["bright", "fgRed"],
                },
                failLoad: {
                    command: ["bright", "fgMagenta"],
                    type: ["fgRed"],
                    text: ["bright", "fgRed"],
                },
                loaded: {
                    command: ["bright", "fgCyan"],
                    type: ["bright", "fgBlue"],
                    text: ["bright", "fgGreen"],
                },
            },
            diff: {
                loading: ["fgGreen"],
                failedLoading: {
                    text: ["fgRed"],
                    name: ["bright", "fgRed"],
                },
                typeError: {
                    command: ["bright", "fgRed"],
                    type: ["fgRed"],
                    text: ["dim", "fgRed"],
                },
                failLoad: {
                    command: ["bright", "fgRed"],
                    type: ["fgRed"],
                    text: ["dim", "fgRed"],
                },
                loaded: {
                    command: ["bright", "fgCyan"],
                    type: ["fgCyan"],
                    text: ["dim", "fgCyan"],
                },
            },
        };
    }

    logMessage(message, color) {
        console.log(`${color || ""}${message}${this.allColors.reset}`);
    }

    async load(client, path, debug = true) {
        const isObject = (data) => data instanceof Object && !Buffer.isBuffer(data) && !Array.isArray(data) && !(data instanceof RegExp);

        const walk = async (file) => {
            const something = await fs.promises.readdir(file, { withFileTypes: true })
                .then((f) => f.map((d) => {
                    d.name = `${file}${PATH.sep}${d.name}`;
                    return d;
                }));

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
                keys: Object.keys(client),
            });
        }

        const validCmds = Object.getOwnPropertyNames(client);
        const dirents = await walk(path);
        const debugs = [];

        for (const { name } of dirents) {
            delete require.cache[name];

            let cmds;

            try {
                cmds = require(name);
            } catch {
                debugs.push(
                    `${this.allColors.fgRed}✖ Failed to load ${name}${this.allColors.reset}`
                );
                continue;
            }

            if (cmds == null) {
                debugs.push(
                    `${this.allColors.fgRed}✖ No data provided in ${name}${this.allColors.reset}`
                );
                continue;
            }

            if (!Array.isArray(cmds)) cmds = [cmds];

            for (const cmd of cmds) {
                if (!isObject(cmd)) {
                    debugs.push(`${this.allColors.fgRed}✖ Provided data is not an object in ${name}${this.allColors.reset}`);
                    continue;
                }

                if (!("type" in cmd)) cmd.type = "default";

                const valid = validCmds.includes(cmd.type);

                if (!valid) {
                    const debugMessage = `${this.allColors.fgRed}✖ Invalid Type Provided for ${cmd.name || cmd.channel} in ${name} | ${cmd.type}${this.allColors.reset}`;
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
                    debugs.push(`${this.allColors.fgRed}✖ Failed to load '${cmd.name || cmd.channel}' in '${name}' | ${cmd.type}${this.allColors.reset}`);
                    continue;
                }

                debugs.push(`${this.allColors.fgGreen}✔ Loaded '${cmd.name || cmd.channel}' | ${cmd.type}${this.allColors.reset}`);
            }
        }

        if (debug) {
            AoiError.createConsoleMessage(
                [
                    {
                        text: `${debugs.join("\n  ")}`,
                    },
                ],
                "white"
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
