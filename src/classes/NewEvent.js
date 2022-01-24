const Collection = require("../cachehandler/index.js").cache;
const EventExecuter = require("../handler/eventExecuter.js");
const {EventEmitter} = require("events");

class CustomEvent extends EventEmitter {
    constructor(client) {
        super(client);
        this.client = client;
        this.commands = new Collection();
        this.client.customEvents = this;
    }

    command(d = {}) {
        if (!d.listen) {
            throw new TypeError(`Listen is not provided in ${d.name}`);
        }
        if (!d.code) {
            throw new TypeError(`Code is not provided in ${d.name}`);
        }

        this.commands.set(d.name, d);
    }

    listen(event) {
        this.on(event, async (...data) => {
            const commands = this.commands.filter(
                (x) => x.listen.toLowerCase() === event,
            );
            EventExecuter(event, this.client, commands, ...data);
        });
    }
}

module.exports = CustomEvent;
