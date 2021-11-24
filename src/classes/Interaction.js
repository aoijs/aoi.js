const {cache: Group} = require("../cachehandler/index.js");
const {EventEmitter} = require("events");

class Interaction extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;
    }

    resolve(data) {
        data.author = data.user;
    }
}

class Await extends Interaction {
    constructor(options, client, varData = {}) {
        super(client);
        this.options = options;
        this.tries = 0;
        this.data = varData;
    }

    async await(msgid, user, customID, data) {
        this.resolve(data);
        if (
            this.options.msgId === msgid &&
            this.options.filter === user &&
            this.options.customIds.includes(customID) &&
            this.options.uses > this.tries
        ) {
            this.emit("AwaitComponent", data);

            this.tries += 1;
        } else if (this.options.uses <= this.tries) {
            this.removeAllListeners("AwaitComponent");
        }
        if (
            this.options.filter !== user &&
            this.options.filter !== "everyone" &&
            this.options.uses > this.tries &&
            this.options.msgId === msgid
        ) {
            if (Object.keys(this.options.errorMessage).length !== 0) {
                data.reply(JSON.parse(this.options.errorMessage));
            }
        }
    }
}

class CustomCollector extends Interaction {
    constructor(options, client, varData = {}) {
        super(client);
        this.options = options;
        this.mainData = [];
        this.timeout = setTimeout;
        this.endsOn = Date.now() + Number(options.time);
        this.data = varData;
    }

    async start(msgid, user, customID, data) {
        this.resolve(data);
        if (
            this.options.customIDs.includes(customID) &&
            this.endsOn >= Date.now() &&
            this.options.msgId === msgid &&
            (this.options.filter === "everyone" || this.options.filter === user)
        ) {
            this.mainData.push(data);
            this.emit("ItemFound", data);
        }
        this.timeout(() => {
            this.emit("CustomCollectorOff", this.mainData);
            delete this.options._timeout;
            delete this._events.ItemFound;
        }, this.options._timeout);

        if (
            this.options.filter !== "everyone" &&
            this.options.filter !== user &&
            Object.keys(this.options.errorMessage).length !== 0 &&
            this.endsOn > Date.now() &&
            this.options.msgid === msgid
        ) {
            data.reply(this.options.errorMessage);
        }
    }
}

class InteractionManager extends Interaction {
    constructor(client) {
        super(client);
        this.awaitComponents = Await;
        this.ComponentCollector = CustomCollector;

        this.buttonData = new Group();
        this.applicationData = new Group();
        this.selectMenuData = new Group();
    }

    createApplicationData(d = {}) {
        this.applicationData.set(
            d.guildId ? `${d.data.name}_${d.guildId}` : d.data.name,
            d.data,
        );
    }

    createButtonData(d = {}) {
        this.buttonData.set(d.customId, d);
    }

    createSelectMenuData(d = {}) {
        this.selectMenuData.set(d.customId, d);
    }

    stringifyApplicationData(name) {
        return JSON.stringify(this.ApplicationData.get(name));
    }

    resolveButtonData(customId) {
        const d = this.buttonData.get(customId);
        return `{button:${d.label}:${d.style}:${d.customId}:${d.disabled}:${d.emoji}}`;
    }

    resolveSelectMenuData(customId) {
        const d = this.selectMenuData.get(customId);
        return `{selectMenu:${d.customId}:${d.placeholder}:${d.minValues}:${
            d.maxValues
        }:${d.disabled}:${this.resolveSelectMenuOptionData(d.options)}`;
    }

    resolveSelectMenuOptionData(options) {
        let opt = [];
        for (const o of options) {
            opt.push(
                `{selectMenuOptions:${o.label}:${o.value}:${o.description}:${o.default}:${o.emoji}}`,
            );
        }
        return opt.join("");
    }

    get buttonDataLength() {
        return this.buttonData.size;
    }
}

module.exports = InteractionManager;
