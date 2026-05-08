const fs = require("fs");
const PATH = require("path");
const chalk = require("chalk");
const { EventsToDjsEvents } = require("../utils/Constants.js");
const AoiError = require("./AoiError");

class LoadEvents {
    constructor(client, addClassInClient = true) {
        this.client = client;
        this.paths = [];
        this.colors = {};
        if (addClassInClient) {
            this.client.eventLoader = this;
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
                    event: [chalk.bold.yellow],
                    type: [chalk.yellow],
                    text: [chalk.bold.red]
                },
                failLoad: {
                    event: [chalk.bold.magenta],
                    type: [chalk.red],
                    text: [chalk.bold.red]
                },
                loaded: {
                    event: [chalk.bold.cyan],
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
                    event: [chalk.bold.red],
                    type: [chalk.red],
                    text: [chalk.dim.red]
                },
                failLoad: {
                    event: [chalk.bold.red],
                    type: [chalk.red],
                    text: [chalk.dim.red]
                },
                loaded: {
                    event: [chalk.bold.cyan],
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
            this.paths.push({ path, debug, client });
        }

        const validAoi = Object.keys(EventsToDjsEvents);
        const validDjs = new Set(Object.values(EventsToDjsEvents));
        const dirents = await walk(path);
        let debugs = [];

        for (const { name } of dirents) {
            if (!name.endsWith(".js")) continue;
            delete require.cache[name];

            let events;
            try {
                events = require(name);
            } catch {
                debugs.push(`${chalk.red("✖ Failed to load")} ${name}`);
                continue;
            }

            if (events == null) {
                debugs.push(`${chalk.red("✖ No data provided in")} ${name}`);
                continue;
            }

            if (!Array.isArray(events)) events = [events];

            for (const event of events) {
                const pathArr = name.split(PATH.sep);
                const pathName = pathArr.length > 2 ? pathArr.slice(-3).join(PATH.sep) : name;

                if (!isObject(event)) {
                    debugs.push(`${chalk.red("✖ Provided data is not an object in")} ${pathName}`);
                    continue;
                }

                if (!event.type && !event.name) {
                    debugs.push(`${chalk.red("✖ Missing Type Or Name For Event in")} '${pathName}'`);
                    continue;
                }

                let type = (event.type || event.name).toString();
                const source = (event.source || event.mode || "").toString().toLowerCase();

                if (type.startsWith("$")) {
                    type = type.slice(1);
                }

                let eventName;
                if (source === "aoi" || source === "aoijs" || source === "aoi.js") {
                    eventName = EventsToDjsEvents[type];
                } else if (source === "djs" || source === "discordjs" || source === "discord") {
                    eventName = type;
                } else if (validAoi.includes(type)) {
                    eventName = EventsToDjsEvents[type];
                } else if (validDjs.has(type)) {
                    eventName = type;
                }

                if (!eventName) {
                    const debugMessage = `${chalk.red("✖ Invalid Type Provided For Event")} '${pathName}' ${chalk.gray(`(${type})`)}`;
                    debugs.push(debugMessage);
                    continue;
                }

                const handler = typeof event.code === "function" ? event.code : typeof event.handler === "function" ? event.handler : typeof event.execute === "function" ? event.execute : undefined;

                if (!handler) {
                    const debugMessage = `${chalk.red("✖ Missing Handler For Event")} '${pathName}' ${chalk.gray(`(${type})`)}`;
                    debugs.push(debugMessage);
                    continue;
                }

                const listener = (...args) => handler(...args, client);
                if (event.once) {
                    client.once(eventName, listener);
                } else {
                    client.on(eventName, listener);
                }

                const debugMessage = `${chalk.green("✔ Loaded")} '${pathName}' ${chalk.gray(`(${type})`)}`;
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
                { text: "LoadEvents", textColor: "cyan" }
            );
        }
    }
}

module.exports = LoadEvents;
