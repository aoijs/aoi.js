import { Group } from "@akarui/structures";
import { Command } from "../structures/Command.js";
import { CommandOptions } from "../typings/interfaces.js";
import { Optional } from "../typings/types.js";

export class CommandManager {
    basicCommand: Group<string, Command> = new Group<string, Command>(Infinity);
    slashCommand: Group<string, Command> = new Group<string, Command>(Infinity);

    add ( command: Optional<CommandOptions, "__path__"> )
    {
        if ( !command.name ) throw new Error( "Command name is required" );
        if ( !command.type ) throw new Error( "Command type is required" );
        if ( !command.__path__ ) command.__path__ = "root";
        const cmd = new Command(command as CommandOptions);
        if (cmd.type === "basic") this.basicCommand.set(cmd.name, cmd);
        else if (cmd.type === "slash")
            this.slashCommand.set(cmd.name, cmd);
        else throw new Error("Invalid command type");
    }

    addMany(commands: Optional<CommandOptions, "__path__">[]) {
        for (const command of commands) this.add(command);
    }
}
