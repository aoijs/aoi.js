class SlashOption {
    static choice(option) {
        const Choice = [];
        option = option.split("{choice:").slice(1);

        for (let opt of option) {
            opt = opt.split("}")[0].split(":");

            const name = opt.shift()?.addBrackets();
            const value = opt.shift()?.addBrackets();
            Choice.push({name, value});
        }

        return Choice;
    }

    static async string(option) {
        option = option.split("{string:").slice(1);
        const stringOptions = [];
        for (let opt of option) {
            opt = opt.split(":");
            const name = opt.shift()?.addBrackets();
            const description = opt.shift()?.addBrackets();
            const required = opt?.shift()?.addBrackets() === "yes" || false;
            const choice = opt.join(":");

            let choices;
            if (choice.trim().length) {
                choices = this.choice(choice);
            } else choices = [];
            stringOptions.push({type: 3, name, description, required, choices});
        }

        return stringOptions;
    }

    static async integer(options) {
        options = options.split("{integer:").slice(1);
        const integerOptions = [];
        for (let option of options) {
            option = option.split(":");
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const required = opt?.shift()?.addBrackets() === "yes" || false;
            const choice = option.join(":");
            let choices;
            if (choice.trim().length) {
                choices = this.choice(choice);
            } else choices = [];
            integerOptions.push({type: 4, name, description, required, choices});
        }
        return integerOptions;
    }

    static async number(options) {
        options = options.split("{number:").slice(1);
        const numberOptions = [];
        for (const option of options) {
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const required =
                option
                    ?.shift()
                    ?.addBrackets()
                    ?.replace("yes", true)
                    ?.replace("no", false) || true;
            const choice = option.join(":");
            let choices;
            if (choice.trim().length) {
                choices = this.choice(choice);
            } else choices = [];
            numberOptions.push({type: 10, name, description, required, choices});
        }
        return numberOptions;
    }

    static async boolean(options) {
        options = options.split("{boolean:").slice(1);
        const booleanOptions = [];
        for (const option of options) {
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const required =
                option
                    ?.shift()
                    ?.addBrackets()
                    ?.replace("yes", true)
                    ?.replace("no", false) || true;
            booleanOptions.push({type: 5, name, description, required});
        }
        return booleanOptions;
    }

    static async user(options) {
        options = options.split("{user:").slice(1);
        const userOptions = [];
        for (const option of options) {
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const required =
                option
                    ?.shift()
                    ?.addBrackets()
                    ?.replace("yes", true)
                    ?.replace("no", false) || true;
            userOptions.push({type: 6, name, description, required});
        }
        return userOptions;
    }

    static async channel(options) {
        options = options.split("{channel:").slice(1);
        const channelOptions = [];
        for (const option of options) {
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const required =
                option
                    ?.shift()
                    ?.addBrackets()
                    ?.replace("yes", true)
                    ?.replace("no", false) || true;
            channelOptions.push({type: 7, name, description, required});
        }
        return channelOptions;
    }

    static async role(options) {
        options = options.split("{role:").slice(1);
        const roleOptions = [];
        for (const option of options) {
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const required =
                option
                    ?.shift()
                    ?.addBrackets()
                    ?.replace("yes", true)
                    ?.replace("no", false) || true;
            roleOptions.push({type: 8, name, description, required});
        }
        return roleOptions;
    }

    static async mentionable(options) {
        options = options.split("{mentionable:").slice(1);
        const mentionOptions = [];
        for (let option of options) {
            option = option.split("}")[0].split(":");
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const required =
                option
                    ?.shift()
                    ?.addBrackets()
                    ?.replace("yes", true)
                    ?.replace("no", false) || true;
            mentionOptions.push({type: 9, name, description, required});
        }
        return mentionOptions;
    }

    static async subCommand(options) {
        options = options.split("{subCommand:").slice(1);
        const subOptions = [];
        for (let option of options) {
            const index = option.lastIndexOf("}");
            option = option.slice(0, index).split(":");

            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            const opts = option.join(":");
            let Options = [];
            let opt = opts;

            const Checker = (o) => opt.includes(o);
            if (Checker("string")) Options = Options.concat(await this.string(opt));

            if (Checker("integer")) Options = Options.concat(await this.integer(opt));
            if (Checker("boolean")) Options = Options.concat(await this.boolean(opt));
            if (Checker("user")) Options = Options.concat(await this.user(opt));
            if (Checker("channel")) Options = Options.concat(await this.channel(opt));
            if (Checker("role")) Options = Options.concat(await this.role(opt));
            if (Checker("mentionable"))
                Options = Options.concat(await this.mentionable(opt));
            if (Checker("number")) Options = Options.concat(await this.number(opt));

            subOptions.push({name, description, type: 1, options: Options});
        }
        return subOptions;
    }

    static async subGroup(options) {
        options = options.split("{subGroup:").slice(1);
        const GroupOptions = [];
        for (let option of options) {
            const index = option.lastIndexOf("}");
            option = option.slice(0, index).split(":");
            const name = option.shift()?.addBrackets();
            const description = option.shift()?.addBrackets();
            let Option = [];
            const opts = option.join(":");

            Option = Option.concat(await this.subCommand(opts));

            GroupOptions.push({name, description, type: 2, options: Option});
        }
        return GroupOptions;
    }
}

module.exports = SlashOption;