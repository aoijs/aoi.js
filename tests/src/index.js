
import { Client } from "aoi.js";
import config from "./config.js";
import { commandHandler } from "./handler/index.js";

const bot = new Client( config.Client );
await commandHandler( bot );
        