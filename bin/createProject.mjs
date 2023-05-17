import fs from "fs";
import { promisify } from "util";
import { exec } from "child_process";
import path from "path";
import files from "./files.mjs";
import ora from "ora";
import chalk from "chalk";
export default async function createProject(dir, options) {
    const spinnerData = {
        spinner: "dots",
        color: "cyan",
    };
    const projectDir = dir ? path.join(process.cwd(), dir) : process.cwd();

    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir);
    }
    const spinner = ora(spinnerData);
    //creating package.json
    spinner.start();
    if (!fs.existsSync(path.join(projectDir, "package.json"))) {
        spinner.text = chalk.hex("#A64253")("Creating package.json...");
        await fs.promises.writeFile(
            path.join(projectDir, "package.json"),
            "{}",
        );
        spinner.succeed(chalk.hex("#A64253")("Created package.json!"));
    }
    spinner.text = chalk.hex("#A64253")("Installing dependencies...");
    const packagesToInstall = ["dotenv"];
    if (options.music) packagesToInstall.push("@akarui/aoi.music");
    if (options.db) packagesToInstall.push("aoi.db");
    if (options.panel) packagesToInstall.push("@akarui/aoi.panel");
    await promisify(exec)(`npm i ${packagesToInstall.join(" ")}`, {
        cwd: projectDir,
    });

    spinner.succeed(chalk.hex("#A64253")("Installed dependencies!"));

    const spinner2 = ora(spinnerData);
    spinner2.text = chalk.hex("#A64253")("Creating project files...");
    const commandDir = path.join(projectDir, "commands");
    const voiceDir = path.join(projectDir, "voice");
    const customFunctionDir = path.join(projectDir, "customFunctions");

    const spin3 = ora(spinnerData);
    // creating index.js
    spin3.text = chalk.hex("#A64253")("Creating index.js...");
    if (!options.aoi)
        await fs.promises.writeFile(
            path.join(projectDir, "index.js"),
            files.js["index.js"][options.esm ? "esm" : "cjs"],
        );
    else
        await fs.promises.writeFile(
            path.join(projectDir, "index.js"),
            files.aoi["index.js"][options.esm ? "esm" : "cjs"],
        );
    spin3.succeed(chalk.hex("#A64253")("Created index.js!"));

    // creating config.js
    spin3.text = chalk.hex("#A64253")("Creating config.js...");
    if (!options.aoi)
        await fs.promises.writeFile(
            path.join(projectDir, "config.js"),
            files.js["config.js"][options.esm ? "esm" : "cjs"],
        );
    else
        await fs.promises.writeFile(
            path.join(projectDir, "config.js"),
            files.aoi["config.js"][options.esm ? "esm" : "cjs"],
        );
    spin3.succeed(chalk.hex("#A64253")("Created config.js!"));

    //creating commands
    if (!fs.existsSync(commandDir)) {
        await fs.promises.mkdir(commandDir);
        console.group(chalk.hex("#A64253")("∴ Created commands folder!"));
    }
    for (const command of Object.keys(
        options.aoi ? files.aoi.commands : files.js.commands,
    )) {
        await fs.promises.writeFile(
            path.join(commandDir, command),
            options.aoi
                ? files.aoi.commands[command]
                : files.js.commands[command][options.esm ? "esm" : "cjs"],
        );
        console.log(chalk.hex("#A64253")(`∷ Created ${command}!`));
    }
    console.groupEnd();

    spinner2.succeed(chalk.hex("#A64253")("Created project files!"));
}
