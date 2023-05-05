import { Group } from "@akarui/structures";
import { Command } from "../structures/Command.js";
import { CommandOptions } from "../typings/interfaces.js";
import { Optional } from "../typings/types.js";
import fs from "fs/promises";
import { AoiClient } from "../index.js";

export class CommandManager {
    basicCommand: Group<string, Command> = new Group<string, Command>(Infinity);
    slashCommand: Group<string, Command> = new Group<string, Command>(Infinity);
    #client: AoiClient;
    constructor (client:AoiClient) {
        this.#client = client;
    }

    add ( command: Optional<CommandOptions, "__path__"> )
    {
        if ( !command.name ) throw new Error( "Command name is required" );
        if ( !command.type ) throw new Error( "Command type is required" );
        if ( !command.__path__ ) command.__path__ = "root";
        const cmd = new Command(command as CommandOptions,this.#client);
        if (cmd.type === "basic") this.basicCommand.set(cmd.name, cmd);
        else if (cmd.type === "slash")
            this.slashCommand.set(cmd.name, cmd);
        else throw new Error("Invalid command type");
    }

    addMany(commands: Optional<CommandOptions, "__path__">[]) {
        for (const command of commands) this.add(command);
    }
    async load ( path: string ) {
        const stats = await fs.stat(path);
        if (stats.isDirectory()) {
            const files = (await fs.readdir(path));
            for (const file of files) {
                const filePath = path + "/" + file;
                const stats = await fs.stat(filePath);
                if (stats.isDirectory()) await this.load(filePath);
                else if (stats.isFile() && file.endsWith(".js")) {
                    const command = await import(filePath);
                    this.add(command.default);
                }
                // else if(stats.isFile() && file.endsWith(".aoi") && !file.endsWith(".template.aoi")) {
                //     const command = await import(filePath);
                //     this.add(command.default);
                // }
            }
        }
    }
}
