const ErrorParser = require("../../handlers/errorParser.js")
const axios = require('axios')
const {
    Collection
} = require('discord.js')
const {
    EventEmitter
} = require('events')
class CustomCollector extends EventEmitter {
    constructor(msgid, userFilter, time, data, cmds, errorMessage = "", client, command) {
        super();
        
        this.msgid = msgid
        this.filter = userFilter
        this._timeout = time
        this.data = data
        this.cmds = cmds
        this.errmsg = errorMessage
        this.mainData = []
        this.timeout = setTimeout
        this.endsOn = (Date.now() + Number(time));
        Object.defineProperty(this, "client", {
            value: client
        })
    }
    async start(msgid, user, checker, data) {
        
        if (this.data.includes(checker) && this.endsOn >= Date.now() && this.msgid === msgid && (this.filter === "everyone" || this.filter === user)) {
            
            this.mainData.push(data)
            this.emit("ItemFound", data)
        }
        this.timeout(() => {
            this.emit("CustomCollectorOff", this.mainData);
            delete this._timeout
            delete this._events.ItemFound
        }, this._timeout)
        
        if (this.filter !== "everyone" && this.filter !== user && this.errmsg.length !== 0 && this.endsOn > Date.now() && this.msgid === msgid ) {
            this.client.api.interactions(data.id, data.token).callback.post({
                data: {
                    type: 4, 
                    data: {
                        content: this.errmsg[0] || "", 
                        embeds: (this.errmsg[1] !== "" || this.errmsg[1]) ?( Array.isArray(this.errmsg[1]) ? this.errmsg[1] : [this.errmsg[1]]): [],
                        flags: this.errmsg[2] !== "" ? Number(this.errmsg[2]) : 0
                    }
                }  
            }).catch(() => null)
        }
    }
}
module.exports = CustomCollector;
