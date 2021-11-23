class Group extends Map {
    constructor(prototype) {
        super(prototype);
    }

    set(key, value) {
        return super.set(key, value);
    }

    delete(key) {
        return super.delete(key);
    }

    clear() {
        return super.clear();
    }

    top(number = 1) {
        const top = Array.from(this.values()).slice(0, number);
        return top.length <= 1 ? top[0] : top;
    }

    bottom(number = 1) {
        const arr = Array.from(this.values()).slice(`-${number}`);
        return arr.length <= 1 ? arr[0] : arr;
    }

    find(data) {
        return Array.from(this.values()).find(data);
    }

    filter(data, limit = this.size) {
        let keys = Array.from(this.keys());
        let values = Array.from(this.values());
        const filters = Array.from(this.values()).filter(data).slice(0, limit);
        let grp = new Group();
        filters.forEach((x) => grp.set(keys[values.indexOf(x)], x));
        return grp;
    }

    allKeys() {
        return Array.from(this.keys());
    }

    allValues() {
        return Array.from(this.values());
    }

    some(data) {
        return Array.from(this.values()).some(data);
    }

    indexOf(key) {
        return Array.from(this.keys()).indexOf(key);
    }

    findIndex(data) {
        return Array.from(this.values()).findIndex(data);
    }

    includes(data) {
        return this.allValues().includes(data);
    }

    object() {
        let keys = this.allKeys();
        let values = this.allValues();
        let object = {};
        keys.forEach((x) => (object[x] = values[keys.indexOf(x)]));
        return object;
    }

    map(data) {
        return this.allValues().map(data);
    }

    findKey(data) {
        const value = this.allValues().find(data);
        return this.allKeys()[this.allValues().indexOf(value)];
    }

    sort(data) {
        let grp = new Group();
        let sorter = this.allValues().sort(data);
        sorter.forEach((x) =>
            grp.set(
                this.findKey((y) => y === x),
                x,
            ),
        );
        return grp;
    }

    every(data) {
        this.allValues.every(data);
    }

    partition(data) {
        let grp1 = this.filter(data);
        let grp2 = new Group(this);
        grp1.allKeys().forEach((x) => grp2.delete(x));
        return [grp1, grp2];
    }

    getByPosition(index) {
        let grp = new Group();
        const key = this.allKeys()[index - 1];
        grp.set(key, this.get(key));
        return grp;
    }

    reverse() {
        return this.allValues().reverse();
    }

    entries() {
        return Array.from(super.entries());
    }

    concat(...grps) {
        let res = [];
        grps.forEach((x) => res.push(x.entries()));
        res.push(grps.entries());
        let grp = new Group();
        res.forEach((x) => grp.set(x[0], x[1]));
        return grp;
    }

    sweep(func) {
        for (const [key, value] of this) {
            if (func(value, key, this)) this.delete(key);
        }
    }
}

module.exports = Group;
