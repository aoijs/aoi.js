const fs = require("fs");
const { CommandManager } = require("./Commands.js");
const PATH = require("path");

//const Client = require("./Bot.js")
class LoadCommands {
  constructor(client, addClassInClient = true) {
    this.client = client;
    this.paths = [];
    this.colors = {};
    if (addClassInClient) {
      this.client.loader = this;
    }
  }

  async load(client, path, debug = true) {
    function isObject(data) {
      return (
        data instanceof Object &&
        !Buffer.isBuffer(data) &&
        !Array.isArray(data) &&
        !(data instanceof RegExp)
      );
    }

    async function walk(file) {
      const something = await fs.promises
        .readdir(file, { withFileTypes: true })
        .then((f) => {
          return f.map((d) => {
            d.name = `${file}${PATH.sep}${d.name}`;

            return d;
          });
        });

      const files = something.filter((d) => d.isFile());
      const dirs = something.filter((d) => d.isDirectory());

      for (const d of dirs) {
        const items = await walk(d.name);

        files.push(...items);
      }

      return files;
    }

    if (typeof path !== "string")
      throw new TypeError(
        `Expecting typeof string on 'path' parameter, get '${typeof path}' instead`,
      );

    if (!PATH.isAbsolute(path)) path = PATH.resolve(path);

    try {
      if (await fs.promises.stat(path).then((f) => !f.isDirectory()))
        console.error("Error!");
    } catch (e) {
      throw new TypeError("Path is not a valid directory! ErrorMessage: " + e);
    }

    const index = this.paths.findIndex((d) => d.path === path);

    if (index < 0)
      this.paths.push({
        path,
        debug,
        commandsLocation: client,
        keys: Object.keys(client),
      });

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
          `${this.colors.failedWalking?.text || ""} Failed to walk in ${
            this.colors.failedWalking?.name || ""
          }${name}${this.allColors.reset || ""}`,
        );

        continue;
      }

      if (cmds == null) {
        debugs.push(
          `${this.colors.noData?.text || ""} No data provided in ${
            this.colors.noData?.name || ""
          }${name}${this.allColors.reset || ""}`,
        );

        continue;
      }

      if (!Array.isArray(cmds)) cmds = [cmds];

      debugs.push(
        `|${this.colors?.walking || ""} Walking in ${name}${
          this.allColors.reset || ""
        }|`,
      );

      for (const cmd of cmds) {
        if (!isObject(cmd)) {
          debugs.push(` Provided data is not an object`);

          continue;
        }

        if (!("type" in cmd)) cmd.type = "default";

        const valid = validCmds.some((c) => c === cmd.type);

        if (!valid) {
          debugs.push(
            `|${this.colors.typeError?.command || ""}${
              cmd.name || cmd.channel
            }${this.allColors.reset}|${this.colors.typeError?.type || ""}${
              cmd.type
            } ${this.allColors.reset}|${
              this.colors.typeError?.text || ""
            }Invalid Type Provided${this.allColors.reset}|`,
          );

          continue;
        }

        cmd.load = true;
        cmd.__path__ = name.split(PATH.sep).slice(-2).join(PATH.sep);

        try {
          if (client instanceof CommandManager) {
            client.createCommand(cmd);
          } else {
            /*if(cmd.type === "interaction"){
          client[cmd.type][cmd.prototype].set(client[cmd.type][cmd.prototype].size,cmd);
}
            else */
            client[cmd.type].set(client[cmd.type].size, cmd);
          }
        } catch (e) {
          console.error(e);
          debugs.push(
            `|${this.colors.failLoad?.command || ""}'${
              cmd.name || cmd.channel
            }'| ${this.colors.failLoad?.type || ""}${cmd.type}${
              this.allColors.reset
            }| ${this.colors.failLoad?.text || ""}Failed To Load${
              this.allColors.reset
            }|
|-------------------------------------------|`,
          );

          continue;
        }

        debugs.push(`|${this.colors.loaded?.command || ""}'${
          cmd.name || cmd.channel
        }' |${this.colors.loaded?.type || ""}${cmd.type} ${
          this.allColors.reset || ""
        }|${this.colors.loaded?.text || ""}Loaded${this.allColors.reset || ""}|
|------------------------------------------|`);
      }
    }

    if (debug) {
      console.log(
        `|  ${this.colors.loaded?.command || ""}Command${
          this.allColors.reset
        }  |  ${this.colors.loaded?.type || ""}Type${
          this.allColors.reset
        }  |  ${this.colors.loaded?.text}State${this.allColors.reset}  |
|------------------------------------------|\n` + debugs.join("\n"),
      );
    }
  }

  async update(debug = true) {
    for (const dp of this.paths) {
      for (const cmd of dp.keys) {
        try {
          if (cmd === "interaction") {
            dp.commandsLocation.interaction.slash =
              dp.commandsLocation.interaction.slash.filter((x) => !x.load);
            dp.commandsLocation.interaction.button =
              dp.commandsLocation.interaction.button.filter((x) => !x.load);
            dp.commandsLocation.interaction.selectMenu =
              dp.commandsLocation.interaction.selectMenu.filter((x) => !x.load);
            dp.commandsLocation.interaction.modal = dp.commandsLocation.interaction.modal.filter((x) => !x.load);
          } else
            dp.commandsLocation[cmd] = dp.commandsLocation[cmd].filter(
              (x) => !x.load,
            );
          if (cmd.loopInterval) {
            clearInterval(cmd.loopInterval);
          }
        } catch (e) {
          continue;
        }
      }
      await this.load(dp.commandsLocation, dp.path, debug);
    }
  }

  setColors(
    c = {
      failLoad: null,
      walking: null,
      failedWalking: null,
      loaded: null,
      typeError: null,
      noData: null,
    },
  ) {
    for (const co of Object.keys(c)) {
      if (Array.isArray(c[co])) {
        this.colors[co] = c[co]?.map((x) => this.allColors[x]).join(" ");
      } else if (typeof c[co] === "object" && !Array.isArray(c[co])) {
        this.colors[co] = {};
        for (const coo of Object.keys(c[co])) {
          if (Array.isArray(c[co][coo])) {
            this.colors[co][coo] = c[co][coo]
              .map((x) => this.allColors[x])
              .join(" ");
          } else this.colors[co][coo] = c[co][coo];
        }
      } else this.colors[co] = this.allColors[c[co]];
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
        walking: ["blink", "dim", "fgWhite"],
        failedWalking: {
          name: ["bright", "fgYellow", "underline"],

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
        walking: ["fgGreen"],
        failedWalking: {
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
}

module.exports = LoadCommands;