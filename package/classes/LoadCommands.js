const fs = require("fs");
//const Client = require("./Bot.js")
class LoadCommands {
  constructor(client,addClassInClient=true) {
    this.client = client
    this.paths = []
   if(addClassInClient){
    this.client.loader = this 
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
        .then(f => {
          return f.map(d => {
            d.name = `${file}/${d.name}`;

            return d;
          });
        });

      const files = something.filter(d => d.isFile());
      const dirs = something.filter(d => d.isDirectory());

      for (const d of dirs) {
        const items = await walk(d.name);

        files.push(...items);
      }

      return files;
    }

    if (typeof path !== "string")
      throw new TypeError(
        `Expecting typeof string on 'path' parameter, get '${typeof path}' instead`
      );

    if (!require("path").isAbsolute(path)) path = require("path").resolve(path);

    try {
      if (await fs.promises.stat(path).then(f => !f.isDirectory()))
        throw new Error("e");
    } catch {
      throw new TypeError("Path is not a valid directory!");
    }

    const index = this.paths.findIndex(d => d.path === path);

    if (index < 0)
      this.paths.push({
        path,
        debug
      });
this.paths[this.paths.length -1].commandsLocation = client
    const validCmds = Object.getOwnPropertyNames(client);

    const dirents = await walk(path);
    const debugs = [];

    for (const { name } of dirents) {
      delete require.cache[name];

      let cmds;

      try {
        cmds = require(name);
      } catch {
        debugs.push(`| Failed to walk in ${name}`);

        continue;
      }

      if (cmds == null) {
        debugs.push(`| No data provided in ${name}`);

        continue;
      }

      if (!Array.isArray(cmds)) cmds = [cmds];

      debugs.push(`| Walking in ${name}`);

      for (const cmd of cmds) {
        if (!isObject(cmd)) {
          debugs.push(`| Provided data is not an object`);

          continue;
        }

        if (!("type" in cmd)) cmd.type = "default";

        const valid = validCmds.some(c => c === cmd.type);

        if (!valid) {
          debugs.push(
            `| Invalid command type '${cmd.type}' at ${cmd.name || cmd.channel}`
          );

          continue;
        }

        cmd.load = true;

        try {

          client[cmd.type].set(client[cmd.type].size,cmd);
        } catch {
          debugs.push(
            `| Failed to load '${cmd.name || cmd.channel}' (${cmd.type})`
          );

          continue;
        }

        debugs.push(`| Loaded '${cmd.name || cmd.channel}' (${cmd.type})`);
      }
    }

    if (debug) {
      console.log(
        "|------------------------------------------|\n" +
          debugs.join("\n") +
          "\n|------------------------------------------|"
      );
    }
  }
  async update(debug=true){
      for(const dp of this.paths){
          for(const cmd of Object.keys(dp.commandsLocation)){
              dp.commandsLocation[cmd].sweep(x=>x.load === true) 
        if(cmd.loopInterval){ clearInterval(cmd.loopInterval)
                            }
          }
          this.load(dp.commandsLocation,dp.path,debug)
          }
      }
  }


module.exports = LoadCommands;
