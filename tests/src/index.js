
// imports
import { AoiClient } from "aoi.js";
import Config from "./config.js";
import { Commands as CommandHandler,Functions as FunctionHandler }  from "./handler/index.js";

// create a new client
const bot = new AoiClient(Config.Client);

// Handler
await FunctionHandler(bot);
await CommandHandler(bot);
