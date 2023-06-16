import { EventEmitter } from "events";
import { AoiClient } from "./AoiClient.js";
import { Group } from "@akarui/structures";
import { Command } from "./Command.js";
import { Bundler, CommandOptions, TranspiledFuncData } from "../index.js";
import Path from "path";
import fs, { readFile } from "fs/promises";
export class CustomEvent extends EventEmitter {
    commands: Group<string,Command>;
    #client: AoiClient;
    constructor(client: AoiClient) {
        super();
        this.#client = client;
        this.commands = new Group<string,Command>(Infinity);
    }
    listen(eventName:string) {
        this.on(eventName,async (...args) => {
            const cmds = this.commands.filter((cmd) => cmd.listen === eventName);

            for (const cmd of cmds.values()) {
                await cmd.__compiled__({bot:this.#client, eventData:args} as unknown as TranspiledFuncData);
            }
        });
    }
    add(command: CommandOptions) {
        const cmd = new Command(command,this.#client);
        this.commands.set(cmd.name,cmd);
    }
    addMany(commands: CommandOptions[]) {
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
        const Commands: {path:string,loaded:boolean,reason?:string}[] = [];
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

                            Commands.push({path:<string>filePath.split("/").pop(),loaded:true});
                        } catch (e) {
                            /* empty */
                            Commands.push({path:<string>filePath.split("/").pop(),loaded:false,reason:e as string});
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
                            const cmd = Bundler(command,this.#client).command;
                            cmd.__path__ = filePath;
                            this.add(cmd as unknown as CommandOptions);
                            Commands.push({path:<string>filePath.split("/").pop(),loaded:true});
                        } catch (e) {
                            /* empty */
                            Commands.push({path:<string>filePath.split("/").pop(),loaded:false,reason:e as string});
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
                return `∷ ${chalk.cyanBright(cmd.loaded ? "Loaded" : "Failed")} ${chalk.greenBright(
                    cmd,
                )} ${chalk.redBright(cmd.loaded ? "" : cmd.reason)}`;
            }).join("\n")}
        `,
            {
                title: `∴ Loading Events ( ${chalk.yellowBright(Commands.length)} )`,
                borderStyle: "round",
                borderColor: "cyan",
                textAlignment: "left",
                backgroundColor: "black",
                width: 100,
                padding:1,
                dimBorder: true,
                float: "center",
            },
        );

        console.log(box);
    }
}