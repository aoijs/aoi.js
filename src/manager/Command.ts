import { Group } from "@akarui/structures";
import { Command } from "../structures/Command.js";
import { CommandOptions, TranspiledFuncData } from "../typings/interfaces.js";
import { CommandTypes, Optional } from "../typings/types.js";
import fs, { readFile } from "fs/promises";
import { AoiClient, Bundler } from "../index.js";
import Path from "path";

export class CommandManager {
    basic: Group<number, Command> = new Group<number, Command>(Infinity);
    interaction: Group<number, Command> = new Group<number, Command>(Infinity);
    ready: Group<number, Command> = new Group<number, Command>(Infinity);
    debug: Group<number, Command> = new Group<number, Command>(Infinity);
    component: Group<string, Command> = new Group<string, Command>(Infinity);
    #client: AoiClient;
    constructor(client: AoiClient) {
        this.#client = client;
    }
    isValidType(type: string) {
        return ["basic", "interaction", "ready", "debug"].includes(type);
    }
    get types() {
        return ["basic", "interaction", "ready", "debug"];
    }

    static cmdTypes() {
        return ["basic", "interaction", "ready", "debug", "component"];
    }
    add(command: Optional<CommandOptions, "__path__">) {
        if (!command.name) throw new Error("Command name is required");
        if (!command.type) throw new Error("Command type is required");
        if (!command.__path__) command.__path__ = "root";
        const cmd = new Command(command as CommandOptions, this.#client);
        if (this.isValidType(command.type) && command.type !== "component")
            this[command.type].set(this[command.type].size, cmd);
        else {
            if (command.type === "component")
                this.component.set(command.name, cmd);
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                throw new Error("Invalid command type provided", {
                    ...command,
                });
            }
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
        const chalk = (await import("chalk")).default;
        const boxen = (await import("boxen")).default;
        const stats = await fs.stat(path);
        const Commands: { path: string; loaded: boolean; reason?: string }[] =
            [];
        if (!usingAoi) {
            if (stats.isDirectory()) {
                const files = await fs.readdir(path);
                for (const file of files) {
                    const filePath = path + "/" + file;
                    const stats = await fs.stat(filePath);
                    if (stats.isDirectory())
                        await this.load({ path: filePath, usingAoi });
                    else if (
                        stats.isFile() &&
                        file.endsWith(".js") &&
                        !file.endsWith(".template.js")
                    ) {
                        // importing on windows
                        let command;
                        try {
                            command = await this.loadFile(filePath);
                            if (Array.isArray(command.default)) {
                                this.addMany(command.default);
                            } else this.add(command.default);

                            Commands.push({
                                path: <string>filePath.split("/").pop(),
                                loaded: true,
                            });
                        } catch (e) {
                            /* empty */
                            Commands.push({
                                path: <string>filePath.split("/").pop(),
                                loaded: false,
                                reason: e as string,
                            });
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
                    else if (
                        stats.isFile() &&
                        file.endsWith(".aoi") &&
                        !file.endsWith(".template.aoi")
                    ) {
                        const command = await readFile(filePath, "utf-8");
                        try {
                            const cmd = Bundler(command, this.#client).command;
                            cmd.__path__ = filePath;
                            this.add(cmd as unknown as CommandOptions);
                            Commands.push({
                                path: <string>filePath.split("/").pop(),
                                loaded: true,
                            });
                        } catch (e) {
                            /* empty */
                            Commands.push({
                                path: <string>filePath.split("/").pop(),
                                loaded: false,
                                reason: e as string,
                            });
                        }
                    }
                    // else if(stats.isFile() && file.endsWith(".aoi") && !file.endsWith(".template.aoi")) {
                    //     const command = await import(filePath);
                    //     this.add(command.default);
                    // }
                }
            }
        }
        const box = boxen(
            `${Commands.map((cmd) => {
                return `∷ ${chalk.cyanBright(
                    cmd.loaded ? "Loaded" : "Failed",
                )} ${chalk.greenBright(cmd.path)} ${chalk.redBright(
                    cmd.loaded ? "" : cmd.reason,
                )}`;
            }).join("\n")}
        `,
            {
                title: `∴ Loading ${chalk.blueBright(
                    path,
                )} ( ${chalk.yellowBright(Commands.length)} )`,
                borderStyle: "round",
                borderColor: "cyan",
                textAlignment: "left",
                backgroundColor: "black",
                width: 100,
                padding: 1,
                dimBorder: true,
                float: "center",
            },
        );

        console.log(box);
    }

    async exec({
        type,
        data,
        filter,
    }: {
        type: CommandTypes;
        data: TranspiledFuncData;
        filter: (cmd: Command) => boolean;
    }) {
        const cmd = this[type].filter((cmd) => filter(cmd));
        if (cmd.size) {
            for (const command of cmd.values()) {
                this.#client.managers.plugins.preCommand.forEach((plugin) => {
                    plugin.func({ command, data });
                });
                await command.__compiled__({ ...data, command });
                this.#client.managers.plugins.postCommand.forEach((plugin) => {
                    plugin.func({ command, data });
                });
            }
        }
    }
    async loadFile(filePath: string) {
        let command;
        try {
            command = require(filePath);
        } catch {
            if (process.platform === "win32") {
                const fp = Path.join("file:///", process.cwd(), filePath);
                command = await import(fp);
            } else {
                command = await import(Path.join(process.cwd(), filePath));
            }
        }

        return command;
    }
}
