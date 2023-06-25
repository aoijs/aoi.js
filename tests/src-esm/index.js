
import { AoiClient } from "aoi.js";
import config from "./config.js";

const bot = new AoiClient( config.Client );

await bot.managers.commands.load({ path: "./commands" });
        