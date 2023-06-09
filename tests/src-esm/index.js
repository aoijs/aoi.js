
import { Client } from "aoi.js";
import config from "./config.js";

const bot = new Client( config.Client );

await bot.managers.commands.load({ path: "./commands" });
        