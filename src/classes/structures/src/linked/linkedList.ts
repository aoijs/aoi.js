import * as Types from "./types";
import {Node} from "./node";

export class LinkedList {
	head: null | Node;
	size: number;
	__lastNode__?: Node;
	constructor() {
		this.head = null;
		this.size = 0;
		Object.defineProperty(this, "__lastNode__", {
			value: null,
			writable: true,
			enumerable: true,
		});
	}
	/**
	 * @method add
	 * @description adds an element to the list
	 * @param element element to be added in the list
	 */
	public add(element: unknown): void {
		const node = new Node(element);
		if (!this.head) {
			this.head = node;
		} else {
			let curr = this.head;
			while (curr.next) {
				curr = curr.next;
			}
			curr.next = node;
		}
		this.size++;
		this.__lastNode__ = node;
	}
	/**
	 * removeLast
	 */
	public removeLast() {
		let curr = this.head;
		let prev;

		while (curr?.next) {
			prev = curr;
			curr = curr.next;
		}
		if(!prev) return null;
		prev.next = null;
		this.__lastNode__ = prev;
		this.size--;
		return curr;
	}
	/**
	 * remove
	 */
	public remove(element: unknown): void {
		let curr = this.head;
		let prev;

		if (!curr) return;
		else if (curr.element === element) {
			curr = curr.next;
			this.head = curr;
		} else {
			while (curr) {
				prev = curr;
				if ((curr.element = element)) {
					prev.next = curr.next;
					break;
				} else {
					curr = curr.next;
				}
			}
		}
		this.size--;
	}
	/**
	 * insertAt
	 */
	public insertAt(index: number, element: unknown): void {
		const node = new Node(element);

		if (index < 0 || index > this.size) {
			throw new Error("Index Can Only be from 0 to " + this.size);
		} else {
			let curr = this.head;
			if(!curr) {
				this.head = node;
				return ;
			}
			let i = 0;
			while (i < index) {
				if(!curr) break;
				curr = curr.next;
				i++;
			}
			curr = node;
		}
	}
	/**
	 * isEmpty
	 */
	public isEmpty(): boolean {
		return this.head ? false : true;
	}
	/**
	 * map
	 */
	public map<U>(func: (element: unknown, node: Node) => U): U[] {
		let curr = this.head;
		let res: U[] = [];

		if (!curr) return res;
		else {
			while (curr) {
				res.push(func(curr.element, curr));
			}
			return res;
		}
	}
	/**
	 * forEach
	 */
	public forEach<U>(func: (element: unknown, node: Node) => U): void {
		let curr = this.head;

		if (!curr) return;
		else {
			while (curr) {
				func(curr.element, curr);
			}
		}
	}
}
