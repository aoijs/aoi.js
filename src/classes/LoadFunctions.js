const fs = require("fs");
const PATH = require("path");
const chalk = require("chalk");
const AoiError = require("./AoiError");

class LoadFunctions {
    constructor(client, addClassInClient = true) {
        this.client = client;
        this.paths = [];
        this.colors = {};
        if (addClassInClient) {
            this.client.functionLoader = this;
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

    async load(path, debug = true) {
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

        const dirents = await walk(path);
        let debugs = [];

        for (const { name } of dirents) {
            if (!name.endsWith(".js")) continue;
            delete require.cache[name];

            let funcs;
            try {
                funcs = require(name);
            } catch {
                debugs.push(`${chalk.red("✖ Failed to load")} ${name}`);
                continue;
            }

            if (funcs == null) continue;
            if (!Array.isArray(funcs)) funcs = [funcs];

            for (const func of funcs) {
                const pathArr = name.split(PATH.sep);
                const pathName = pathArr.length > 2 ? pathArr.slice(-3).join(PATH.sep) : name;

                if (!isObject(func)) {
                    debugs.push(`${chalk.red("✖ Provided data is not an object in")} ${pathName}`);
                    continue;
                }

                if (!func.type) func.type = "aoi.js";

                if (!func.name) {
                    debugs.push(`${chalk.red("✖ Missing Name For Function in")} '${pathName}'`);
                    continue;
                }

                try {
                    this.client.functionManager.createFunction(func);
                    const debugMessage = `${chalk.green("✔ Loaded")} '${chalk.cyan(func.name)}' ${chalk.gray(`(${func.type})`)}`;
                    debugs.push(debugMessage);
                } catch (e) {
                    const debugMessage = `${chalk.red("✖ Failed to load function")} '${func.name}' ${chalk.red("in")} '${pathName}'`;
                    debugs.push(debugMessage);
                    continue;
                }
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
                { text: "LoadFunctions", textColor: "cyan" }
            );
        }
    }
}

module.exports = LoadFunctions;
