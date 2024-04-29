import PriorityQueue from "../src/PriorityQueue/index.ts";

describe('PriorityQueue', () => {

	let pq: PriorityQueue;

	beforeEach(() => {
		pq = new PriorityQueue( );
	});

	test('PriorityQueue#constructor', () => {
		expect(pq).toBeInstanceOf(PriorityQueue);
	});

	test('PriorityQueue#push', () => {	
		pq.push(1, 2, 3);
		expect(pq.size()).toBe(3);
	});

	test('PriorityQueue#isEmpty -> not empty', () => {
		pq.push(1, 2, 3);
		expect(pq.isEmpty()).toBe(false);
	});

	test('PriorityQueue#isEmpty -> empty', () => {
		expect(pq.isEmpty()).toBe(true);
	});

	test('PriorityQueue#peek', () => {
		pq.push(1, 2, 3);
		expect(pq.peek()).toBe(1);
	});

	test('PriorityQueue#pop', () => {
		pq.push(1, 2, 3);
		expect(pq.pop()).toBe(1);
		expect(pq.size()).toBe(2);
	});

	test('PriorityQueue#findIndex', () => {
		pq.push(1, 2, 3);
		expect(pq.findIndex(2)).toBe(1);
	});

	test('PriorityQueue#findFromProp', () => {
		pq.push(1, 2, 3);
		expect(pq.findFromProp((a:number) => a === 2)).toBe(1);
	});

	test('PriorityQueue#findFromProp -> not found', () => {
		pq.push(1, 2, 3);
		expect(pq.findFromProp((a:number) => a === 4)).toBe(-1);
	});

	test('PriorityQueue#replace', () => {
		pq.push(1, 2, 3);
		pq.replace(4);
		expect(pq.peek()).toBe(2);
	});

	test('PriorityQueue#remove', () => {
		pq.push(1, 2, 3);
		pq.remove(2);
		expect(pq.size()).toBe(2);
	});

	test('PriorityQueue#clear', () => {
		pq.push(1, 2, 3);
		pq.clear();
		expect(pq.size()).toBe(0);
	});
});