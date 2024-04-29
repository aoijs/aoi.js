import Group from '../src/Group/index.ts';

describe('Group', () => {
	let group: Group<number, string>;
	beforeEach(() => {
		group = new Group(5);
	});

	test('Group#constructor', () => {
		expect(group).toBeInstanceOf(Group);
	});

	test('Group#set', () => {
		group.set(1, 'a');
		expect(group.size).toBe(1);
	});

	test('Group#delete', () => {
		group.set(1, 'a');
		group.delete(1);
		expect(group.size).toBe(0);
	});

	test('Group#clear', () => {
		group.set(1, 'a');
		group.clear();
		expect(group.size).toBe(0);
	});

	test('Group#has', () => {
		group.set(1, 'a');
		expect(group.has(1)).toBe(true);
	});

	test('Group#get', () => {
		group.set(1, 'a');
		expect(group.get(1)).toBe('a');
	});

	test('Group#entries', () => {
		group.set(1, 'a');
		expect([...group.entries()]).toEqual([[1, 'a']]);
	});

	test('Group#K', () => {
		group.set(1, 'a');
		expect(group.K()).toEqual([1]);
	});

	test('Group#values', () => {
		group.set(1, 'a');
		expect(group.V()).toEqual(['a']);
	});

	test('Group#top', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		expect(group.top()).toEqual('a');
		expect(group.top(2)).toEqual(['a', 'b']);
	});

	test('Group#bottom', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		expect(group.bottom()).toEqual('b');
		expect(group.bottom(2)).toEqual(['a', 'b']);
	});

	test('Group#shift', () => {
		group.set(1, 'a');
		expect(group.shift()).toEqual('a');
		expect(group.size).toBe(0);
	});

	test('Group#shiftN', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		group.set(3, 'c');
		expect(group.shiftN(2)).toEqual(['a', 'b']);
		expect(group.size).toBe(1);
	});

	test('Group#pop', () => {
		group.set(1, 'a');
		expect(group.pop()).toEqual('a');
		expect(group.size).toBe(0);
	});

	test('Group#popN', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		group.set(3, 'c');
		expect(group.popN(2)).toEqual(['c', 'b']);
		expect(group.size).toBe(1);
	});

	test('Group#clone', () => {
		group.set(1, 'a');
		const clone = group.clone();
		expect(clone).toEqual(group);
	});

	test('Group#filter', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		expect(group.filter((val) => val === 'a')).toEqual(
			new Group(5).set(1, 'a'),
		);
	});

	test('Group#add', () => {
		group.add('a');
		expect(group.size).toBe(1);
	});

	test('Group#diff', () => {
		group.set(1, 'a');
		const group2 = new Group<number, string>(5).set(2, 'b');
		const group3 = group.diff(group2);
		expect(group3.V()).toEqual(['a','b']);
	});

	test('Group#union', () => {
		group.set(1, 'a');
		const group2 = new Group<number, string>(5).set(2, 'b');
		expect(group.union(group2)).toEqual(
			new Group(5).set(1, 'a').set(2, 'b'),
		);
	});

	test('Group#maxSize', () => {
		expect(group.maxSize).toBe(5);
	});

	test('Group#size', () => {
		expect(group.size).toBe(0);
	});

	test('Group#intersect', () => {
		group.set(1, 'a');
		const group2 = new Group<number, string>(5).set(1, 'b');
		expect(group.intersect(group2)).toEqual(new Group(5).set(1, 'a'));
	});

	test('Group#find', () => {
		group.set(1, 'a');
		expect(group.find((val) => val === 'a')).toEqual('a');
	});

	test('Group#findKey', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		expect(group.findKey((val) => val === 'a')).toEqual(1);
	});

	test('Group#findEntry', () => {
		group.set(1, 'a');
		expect(group.findEntry((val) => val === 'a')).toEqual([1, 'a']);
	});

	test('Group#some', () => {
		group.set(1, 'a');
		expect(group.some((val) => val === 'a')).toBe(true);
	});

	test('Group#every', () => {
		group.set(1, 'a');
		expect(group.every((val) => val === 'a')).toBe(true);
	});

	test('Group#map', () => {
		group.set(1, 'a');
		expect(group.map((val) => val)).toEqual(new Group(5).set(1, 'a'));
	});

	test('Group#findIndex', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		group.set(3, 'c');

		expect(group.findIndex((val) => val === 'a')).toEqual(0);
	});

	test('Group#reduce', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		group.set(3, 'c');

		expect(group.reduce((acc, val) => acc + val)).toEqual('abc');
	});

	test('Group#break', () => {
		group.set(1, 'a');
		group.set(2, 'b');
		group.set(3, 'c');

		expect(group.break((val) => val === 'a')).toEqual([
			new Group(5).set(1, 'a'),
			new Group(5).set(2, 'b').set(3, 'c'),
		]);
	});

	test('Group#sort', () => {
		group.set(1, 'c');
		group.set(2, 'b');
		group.set(3, 'a');

		expect(group.sort((a, b) => a.localeCompare(b))).toEqual(
			new Group(5).set(3, 'a').set(2, 'b').set(1, 'c'),
		);
	});

	test('Group#weakSort', () => {
		group.set(1, 'c');
		group.set(2, 'b');
		group.set(3, 'a');

		expect(group.weakSort()).toEqual(
			new Group(5).set(3, 'a').set(2, 'b').set(1, 'c'),
		);
	});

	test('Group#sortKeys', () => {
		const group = new Group<string, string>(5)
			.set('c', 'a')
			.set('b', 'b')
			.set('a', 'c');

		expect(group.sortKeys((a, b) => a.localeCompare(b))).toEqual(
			new Group(5).set('a', 'c').set('b', 'b').set('c', 'a'),
		);
	});

	test('Group#toJSON', () => {
		group.set(1, 'a');
		expect(group.toJSON()).toEqual({ 1: 'a' });
	});
});
