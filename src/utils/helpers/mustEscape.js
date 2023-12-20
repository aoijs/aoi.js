module.exports = {
    mustEscape: (msg) => {
        return msg
            .split("\\[")
            .join("#RIGHT#")
            .replace(/\\]/g, "#LEFT#")
            .replace(/\\;/g, "#SEMI#")
            .replace(/\\:/g, "#COLON#")
            .replace(/\\$/g, "#CHAR#")
            .replace(/\\>/g, "#RIGHT_CLICK#")
            .replace(/\\</g, "#LEFT_CLICK#")
            .replace(/\\=/g, "#EQUAL#")
            .replace(/\\{/g, "#RIGHT_BRACKET#")
            .replace(/\\}/g, "#LEFT_BRACKET#")
            .replace(/\\,/g, "#COMMA#")
            .replace(/\\&&/g, "#AND#")
            .replaceAll("\\||", "#OR#");
    },
};
