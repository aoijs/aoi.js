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
            `{ 
                ${options.esm ? "\"type\": \"module\"" : ""}
            }`,
        );
        spinner.succeed(chalk.hex("#A64253")("Created package.json!"));
    }
    spinner.text = chalk.hex("#A64253")("Installing dependencies...");
    const packagesToInstall = ["dotenv"];
    if (options.music) packagesToInstall.push("@akarui/aoi.music");
    if (options.db) packagesToInstall.push("aoi.db");
    if (options.panel) packagesToInstall.push("@akarui/aoi.panel");
    const {stderr,stdout} = await promisify(exec)(`npm i ${packagesToInstall.join(" ")}`, {
        cwd: projectDir,
    });
    if (stderr) {
        console.log(stderr);
        process.exit(1);
    }
    console.log(stdout);
    spinner.succeed(chalk.hex("#A64253")("Installed dependencies!"));

    const spinner2 = ora(spinnerData);
    spinner2.text = chalk.hex("#A64253")("Creating project files...");
    const commandDir = path.join(projectDir, "commands");
    const voiceDir = path.join(projectDir, "voice");

    const spin3 = ora(spinnerData);
    // creating index.js
    spin3.text = chalk.hex("#A64253")("Creating index.js...");
    await fs.promises.writeFile(
        path.join(projectDir, "index.js"),
        options.aoi ? files.aoi[options.esm ? "esm" : "cjs"]["index.js"] : files[options.esm ? "esm" : "cjs"]["index.js"]
    );
    spin3.succeed(chalk.hex("#A64253")("Created index.js!"));

    // creating config.js
    spin3.text = chalk.hex("#A64253")("Creating config.js...");
    await fs.promises.writeFile(
        path.join(projectDir, "config.js"),
        files[options.esm ? "esm" : "cjs"]["config.js"],
    );
    spin3.succeed(chalk.hex("#A64253")("Created config.js!"));

    //creating commands
    if (!fs.existsSync(commandDir)) {
        await fs.promises.mkdir(commandDir);
        console.group(chalk.hex("#A64253")("∴ Created commands folder!"));
    }

    await fs.promises.writeFile(
        path.join(commandDir, options.aoi ? "command.template.aoi" : "command.template.js"),
        options.aoi
            ? files.aoi["commands/command.template.aoi"]
            : files[options.esm ? "esm" : "cjs"]["commands/command.template.js"],
    );
    console.log(chalk.hex("#A64253")(`∷ Created ${
        options.aoi ? "command.template.aoi" : "command.template.js"
    }!`));

    console.groupEnd();

    //creating .env

    if (!fs.existsSync(path.join(projectDir, ".env"))) {
        spin3.text = chalk.hex("#A64253")("Creating .env...");
        await fs.promises.writeFile( path.join(projectDir,".env"), "TOKEN=\"your bot token\"");
        spin3.succeed(chalk.hex("#A64253")("Created .env!"));
    }

    spinner2.succeed(chalk.hex("#A64253")("Created project files!"));
}
