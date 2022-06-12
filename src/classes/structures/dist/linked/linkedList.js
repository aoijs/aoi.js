"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedList = void 0;
const node_1 = require("./node");
class LinkedList {
    head;
    size;
    __lastNode__;
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
    add(element) {
        const node = new node_1.Node(element);
        if (!this.head) {
            this.head = node;
        }
        else {
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
    removeLast() {
        let curr = this.head;
        let prev;
        while (curr?.next) {
            prev = curr;
            curr = curr.next;
        }
        if (!prev)
            return null;
        prev.next = null;
        this.__lastNode__ = prev;
        this.size--;
        return curr;
    }
    /**
     * remove
     */
    remove(element) {
        let curr = this.head;
        let prev;
        if (!curr)
            return;
        else if (curr.element === element) {
            curr = curr.next;
            this.head = curr;
        }
        else {
            while (curr) {
                prev = curr;
                if ((curr.element = element)) {
                    prev.next = curr.next;
                    break;
                }
                else {
                    curr = curr.next;
                }
            }
        }
        this.size--;
    }
    /**
     * insertAt
     */
    insertAt(index, element) {
        const node = new node_1.Node(element);
        if (index < 0 || index > this.size) {
            throw new Error("Index Can Only be from 0 to " + this.size);
        }
        else {
            let curr = this.head;
            if (!curr) {
                this.head = node;
                return;
            }
            let i = 0;
            while (i < index) {
                if (!curr)
                    break;
                curr = curr.next;
                i++;
            }
            curr = node;
        }
    }
    /**
     * isEmpty
     */
    isEmpty() {
        return this.head ? false : true;
    }
    /**
     * map
     */
    map(func) {
        let curr = this.head;
        let res = [];
        if (!curr)
            return res;
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
    forEach(func) {
        let curr = this.head;
        if (!curr)
            return;
        else {
            while (curr) {
                func(curr.element, curr);
            }
        }
    }
}
exports.LinkedList = LinkedList;
//# sourceMappingURL=linkedList.js.map