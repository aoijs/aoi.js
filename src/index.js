const AoiClient = require("./classes/AoiClient");
const CustomEvent = require("./classes/CustomEvent.js");
const LoadCommands = require("./classes/LoadCommands.js");
const ClientShard = require("./classes/ClientShard.js");
const AoiError = require("./classes/AoiError.js");
const Util = require("./classes/Util.js");
const Database = require("./classes/Database.js");
const CacheManager = require("./classes/CacheManager.js");

/**
 * AoiClient, custom events, command loader, client shard, error handling and utility functions
 * @namespace
 */
module.exports = {
    AoiClient,
    CustomEvent,
    LoadCommands,
    ClientShard,
    AoiError,
    Util,
    Database,
    CacheManager
};
