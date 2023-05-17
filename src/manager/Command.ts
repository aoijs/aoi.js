import { Group } from "@akarui/structures";
import { Command } from "../structures/Command.js";
import { CommandOptions } from "../typings/interfaces.js";
import { Optional } from "../typings/types.js";
import fs, { readFile } from "fs/promises";
import { AoiClient, Bundler } from "../index.js";
import Path from "path";

export class CommandManager {
    basicCommand: Group<string, Command> = new Group<string, Command>(Infinity);
    slashCommand: Group<string, Command> = new Group<string, Command>(Infinity);
    #client: AoiClient;
    constructor(client: AoiClient) {
        this.#client = client;
    }

    add(command: Optional<CommandOptions, "__path__">) {
        if (!command.name) throw new Error("Command name is required");
        if (!command.type) throw new Error("Command type is required");
        if (!command.__path__) command.__path__ = "root";
        const cmd = new Command(command as CommandOptions, this.#client);
        if (cmd.type === "basic") this.basicCommand.set(cmd.name, cmd);
        else if (cmd.type === "slash") this.slashCommand.set(cmd.name, cmd);
        else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            throw new Error("Invalid command type provided", {
                ...command,
            });
        }
    }

    addMany(commands: Optional<CommandOptions, "__path__">[]) {
        for (const command of commands) this.add(command);
    }
    async load({
        path,
        usingAoi = false,
    }: {
        path: string;
        usingAoi?: boolean;
    }) {
        const stats = await fs.stat(path);
        const Commands: string[] = [];
        console.groupCollapsed(`∴ Loading commands from ${path}`);
        if (!usingAoi) {
            if (stats.isDirectory()) {
                const files = await fs.readdir(path);
                for (const file of files) {
                    const filePath = path + "/" + file;
                    const stats = await fs.stat(filePath);
                    if (stats.isDirectory())
                        await this.load({ path: filePath, usingAoi });
                    else if (stats.isFile() && file.endsWith(".js")) {
                        // importing on windows
                        let command;
                        try {
                            if (process.platform === "win32") {
                                const fp = Path.join(
                                    "file:///",
                                    process.cwd(),
                                    filePath,
                                );
                                command = await import(fp);
                            } else {
                                command = await import(
                                    Path.join(process.cwd(), filePath)
                                );
                            }
                            if (Array.isArray(command.default)) {
                                this.addMany(command.default);
                            } else this.add(command.default);
                        } catch (e) {
                            /* empty */
                        } finally {
                            Commands.push(<string>filePath.split("/").pop());
                        }
                    }
                }
            }
        } else {
            if (stats.isDirectory()) {
                const files = await fs.readdir(path);
                for (const file of files) {
                    const filePath = path + "/" + file;
                    const stats = await fs.stat(filePath);
                    if (stats.isDirectory())
                        await this.load({ path: filePath, usingAoi });
                    else if (stats.isFile() && file.endsWith(".aoi")) {
                        const command = await readFile(filePath, "utf-8");
                        try {
                            const cmd = Bundler(command).command;
                            cmd.__path__ = filePath;
                            this.add(cmd as unknown as CommandOptions);
                        } catch {
                            /* empty */
                        } finally {
                            Commands.push(<string>filePath.split("/").pop());
                        }
                    }
                    // else if(stats.isFile() && file.endsWith(".aoi") && !file.endsWith(".template.aoi")) {
                    //     const command = await import(filePath);
                    //     this.add(command.default);
                    // }
                }
            }
        }
        for(const command of Commands) {
            console.log(`∷ Loaded ${command}`);
        }
        console.groupEnd();
    }
}
