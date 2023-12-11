#! /usr/bin/env node
/* eslint-disable indent */

import chalk from "chalk";
import boxen from "boxen";
import createProject from "./createProject.mjs";
import path from "path";
import { readFileSync } from "fs";
const pack = JSON.parse(readFileSync(path.join(process.cwd(),"./package.json"), "utf-8"));
const argv = process.argv.slice(2).map(x => x.trim());

const name = argv.shift() || "";
if (!name) {
    const msgbox = boxen(
        chalk.cyanBright(
            `
            :~~~~~7J:             
            ^Y?~~~!!~.             
             :.:~7????7^.          
            .!5GBBBGGGGG5!.        
       .   .Y###B##BBGGGBB!..:.    
      7Y7?!5P55PBB5?G##P5PG?Y^              ${chalk.hex("#A64253")("Aoi.js")}
      !GJ7Y5YY5PBBBB###BB#&7       
      7PG~.?PGGB&&&########B?^:             ${chalk.hex("#A64253")("Version:")} ${pack.version} 
      .!YY7GPPPY#&##########&5~    
         :55GGGY#&&#######&###^             ${chalk.hex("#A64253")("Author:")} AkaruiDevelopment
         .5YY5PB&#######&##&&G.    
          7GPG#&&&&&&&&&&&&&G^     
           !Y5PGB#######BGY!.      
             ..::^^^^~^^:.                                                                       
`,
        ),
        {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "cyan",
            align: "left",
            backgroundColor: "#101010",
            title: "Aoi.js",
            float: "center",
            fullscreen: true,
            height: "50%",
        },
    );

    console.log(msgbox);
} else if (name === "help" || name === "-h" || name === "--help") {
    const cmds = {
        help: {
            desc: "Shows this message",
            aliases: ["-h", "--help"],
        },
        version: {
            desc: "Shows the version of AoiBun",
            aliases: ["-v", "--version"],
        },
        new: {
            desc: "Creates a new aoi.js project",
            aliases: ["-n", "--new"],
        },
        bundle: {
            desc: "Bundles the project into a single file",
            aliases: ["-b", "--bundle"],
        },
    };
    const msgbox = boxen(
        Object.entries(cmds)
            .map(
                ([cmd, desc]) =>
                    `${chalk.hex("#8700FF")(
                        cmd.padEnd(10, " "),
                    )} ${chalk.hex("#9721A9")(
                        desc.aliases.join(" ").padEnd(15, " "),
                    )} ${chalk.hex("#A64253")(desc.desc.padEnd(10, " "))}`,
            )
            .join("\n"),
        {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "cyan",
            align: "left",
            backgroundColor: "#101010",
            title: "AoiBun",
            float: "center",
            fullscreen: true,
            height: "100%",
        },
    );

    console.log(msgbox);
} else if ( name === "-v" || name === "--version") {
    console.log(chalk.hex("#A64253")(pack.version));
} else if(name === "new" || name === "-n" || name === "--new") {
    const dir = argv.filter(x => !x.startsWith("--"))[0] || undefined;

    createProject(dir, {
        music: argv.includes("--music"),
        panel: argv.includes("--panel"),
        aoi: argv.includes("--aoi"),
        aoidb: argv.includes("--aoidb"),
        esm: argv.includes("--esm"),
    });
}

