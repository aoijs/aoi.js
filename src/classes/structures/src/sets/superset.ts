export class SuperSet<T = unknown> extends Set<T> {
  constructor(prototype: Iterable<T>) {
    super(prototype);
  }

  squash(...values: T[]) {
    values.forEach((x) => {
      this.add(x);
    });
  }

  get(value: number) {
    const values = this.values();
    value -= 1;
    while (value-- > 0) {
      values.next();
    }
    return values.next().value;
  }

  array() {
    return Array.from(this);
  }

  map(func: (value: T, index: number, array: T[]) => unknown) {
    return this.array().map(func);
  }

  isSubset(set: Iterable<T> | ArrayLike<T>) {
    const subset = Array.from(set);
    const Set = this.array();
    return subset.every((x) => Set.find((y) => y === x));
  }

  isParent(set: Iterable<T> | ArrayLike<T>) {
    const subset = this.array();
    const parent = Array.from(set);
    return subset.every((x) => parent.find((y) => y === x));
  }

  filter(data: (value: T, index: number, array: T[]) => value is T) {
    const filter = this.array().filter(data);
    return new SuperSet(filter);
  }

  find(data: (this: void, value: T, index: number, obj: T[]) => value is T) {
    return this.array().find(data);
  }

  union(...sets: (SuperSet<T> | Set<T>)[]) {
    const mainSet = sets.shift();
            if (!mainSet) return ;
    for (const oset of sets) {
      Array.from(oset).forEach((x: T) => {
        mainSet.add(x);
      });
    }
    return mainSet;
  }

  intersection(...sets: (SuperSet<T> | Set<T>)[]) {
    const mainSet = sets.shift();
            if (!mainSet) return ;
    for (const set of sets) {

      Array.from(set).forEach((x: T) => {
        if (!mainSet.has(x)) mainSet.delete(x);
        else {
        }
      });
    }
    return mainSet;
  }

  difference(setA: SuperSet<T> | Set<T>, setB: SuperSet<T> | Set<T>) {
    for (const value of Array.from(setB)) {
      setA.delete(value);
    }
    return setA;
  }

  equal(set: SuperSet<T> | Set<T>) {
    let pass = true;
    const thisSet = this.array();
    const arrayset = Array.from(set);
    if (this.size !== arrayset.length) pass = false;
    for (let i = 0; i < thisSet.length; i++) {
      if (thisSet[0] === arrayset[0]) continue;
      else {
        pass = false;
        break;
      }
    }
    return pass;
  }

  sort(func: (a: T, b: T) => number) {
    return new SuperSet(this.array().sort(func));
  }
}
