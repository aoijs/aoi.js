class SuperSet extends Set {
    constructor(prototype) {
        super(prototype);
    }

    squash(...values) {
        values.forEach((x) => {
            this.add(x);
        });
    }

    keys() {
        return Array.from(super.keys());
    }

    get(value) {
        return this[value];
    }

    values() {
        return Array.from(super.values());
    }

    entries() {
        return Array.from(super.entries());
    }

    array() {
        return Array.from(this);
    }

    map(func) {
        return this.array().map(func);
    }

    isSubset(set) {
        const subset = Array.from(set);
        const Set = this.array();
        return subset.every((x) => Set.find((y) => y === x));
    }

    isParent(set) {
        const subset = this.array();
        const parent = Array.from(set);
        return subset.every((x) => parent.find((y) => y === x));
    }

    filter(data) {
        const filter = this.array.filter(data);
        return new SuperSet(filter);
    }

    find(data) {
        return this.array().find(data);
    }

    union(...sets) {
        const mainSet = sets.shift();
        for (const oset of sets) {
            Array.from(oset).forEach((x) => {
                mainSet.add(x);
            });
        }
        return mainSet;
    }

    intersection(...sets) {
        const mainSet = sets.shift();
        for (const set of sets) {
            Array.from(set).forEach((x) => {
                if (!mainSet.has(x)) mainSet.delete(x);
                else {
                }
            });
        }
        return mainSet;
    }

    difference(setA, setB) {
        for (const value of Array.from(setB)) {
            setA.delete(value);
        }
        return setA;
    }

    equal(set) {
        let pass = true;
        const thisSet = this.array();
        set = Array.from(set);
        if (this.size !== set.length) pass = false;
        for (let i = 0; i < thisSet.length; i++) {
            if (thisSet[0] === set[0]) continue;
            else {
                pass = false;
                break;
            }
        }
        return pass;
    }

    sort(func) {
        return new SuperSet(this.array().sort(func));
    }
}

module.exports = SuperSet;
