class CheckCondition {
    static hasAnd(msg) {
        return msg.includes("&&");
    }

    static hasOr(msg) {
        return msg.includes("||");
    }

    static hasEqual(msg) {
        return msg.includes("==");
    }

    static hasNotEqual(msg) {
        return msg.includes("!=");
    }

    static hasGreater(msg) {
        return msg.includes(">");
    }

    static hasLesser(msg) {
        return msg.includes("<");
    }

    static hasGE(msg) {
        return msg.includes(">=");
    }

    static hasLE(msg) {
        return msg.includes("<=");
    }

    static solveEqual(msg) {
        let pass = true;
        const parts = msg.split("==");

        if (parts[0] !== parts[1]) pass = false;
        return pass;
    }

    static solveNotEqual(msg) {
        let pass = true;
        const parts = msg.split("!=");
        if (parts[0].addBrackets() === parts[1].addBrackets()) pass = false;
        return pass;
    }

    static solveGreater(msg) {
        let pass = true;
        let parts = msg.split(">");
        parts = parts.every((x) => isNaN(x)) ? parts : parts.map((x) => Number(x));
        if (parts[0] <= parts[1]) pass = false;
        return pass;
    }

    static solveLesser(msg) {
        let pass = true;
        let parts = msg.split("<");
        parts = parts.every((x) => isNaN(x)) ? parts : parts.map((x) => Number(x));
        if (parts[0] >= parts[1]) pass = false;
        return pass;
    }

    static solveLE(msg) {
        let pass = true;
        let parts = msg.split("<=");
        parts = parts.every((x) => isNaN(x)) ? parts : parts.map((x) => Number(x));

        if (parts[0] > parts[1]) pass = false;
        return pass;
    }

    static solveGE(msg) {
        let pass = true;
        let parts = msg.split(">=");
        parts = parts.every((x) => isNaN(x)) ? parts : parts.map((x) => Number(x));

        if (parts[0] < parts[1]) pass = false;
        return pass;
    }

    static solveAnd(msg) {
        const parts = msg.split("&&");
        const final = [];
        for (let part of parts) {
            const has = part.includes(")") ? ")" : "";
            part = part.split(")")[0];
            if (this.hasOr(part)) final.push(this.solveOr(part) + has);
            else if (this.hasEqual(part)) final.push(this.solveEqual(part) + has);
            else if (this.hasNotEqual(part))
                final.push(this.solveNotEqual(part) + has);
            else if (this.hasGE(part)) final.push(this.solveGE(part) + has);
            else if (this.hasLE(part)) final.push(this.solveLE(part) + has);
            else if (this.hasGreater(part)) final.push(this.solveGreater(part) + has);
            else if (this.hasLesser(part)) final.push(this.solveLesser(part) + has);
            else if (part.trim() === "") final.push(part);
        }

        return final.join("&&");
    }

    static solveOr(msg) {
        const parts = msg.split("||");
        const final = [];
        for (let part of parts) {
            const has = part.includes(")") ? ")" : "";
            part = part.split(")")[0];
            if (this.hasEqual(part)) final.push(this.solveEqual(part) + has);
            else if (this.hasNotEqual(part))
                final.push(this.solveNotEqual(part) + has);
            else if (this.hasGE(part)) final.push(this.solveGE(part) + has);
            else if (this.hasLE(part)) final.push(this.solveLE(part) + has);
            else if (this.hasGreater(part)) final.push(this.solveGreater(part) + has);
            else if (this.hasLesser(part)) final.push(this.solveLesser(part) + has);
            else if (part.trim() === "") final.push(part);
        }
        return final.join("||");
    }

    static solve(msg) {
        const parts = msg.split("(");
        const final = [];

        for (const part of parts) {
            if (part.trim() === "") {
                final.push("");
                continue;
            }
            let solve = this.solveAnd(part);

            final.push(solve);
        }

        let result = final.join("(");
        if (result.split("(").length !== result.split(")").length)
            result =
                result +
                ")".repeat(result.split("(").length - result.split(")").length);
        return result;
    }
}

module.exports = {
    CheckCondition,
};
