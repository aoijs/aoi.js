import { Group } from "@akarui/structures";
import { Command } from "../structures/Command.js";
import { CommandOptions } from "../typings/interfaces.js";

export class CommandManager {
    basicCommand: Group<string, Command> = new Group<string, Command>(Infinity);
    slashCommand: Group<string, Command> = new Group<string, Command>(Infinity);
    
    addCommand ( command: CommandOptions )
    {
        const cmd = new Command( command );
        if ( cmd.type === "basicCommand" ) this.basicCommand.set( cmd.name, cmd );
        else if ( cmd.type === "slashCommand" ) this.slashCommand.set( cmd.name, cmd );
        else throw new Error( "Invalid command type" );
    }
}