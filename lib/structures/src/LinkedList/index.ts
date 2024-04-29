/*
 Copyright 2024 Akarui Development

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
 
		http://www.apache.org/licenses/LICENSE-2.0
 
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import LinkedNode from "./Node.js";
import isEqual from "../utils/isEqual.js";

export default class LinkedList {
    head: LinkedNode | null = null;
    size: number = 0;

    add(el: any) {
        const node = new LinkedNode(el);
        let head = this.head;
        if (head === null) {
            this.head = node;
            this.size++;
            return;
        }
        while (head?.next !== null) {
            head = head.next;
        }

        head.next = node;
        this.size++;
    }

    addAt(num: number, el: any) {
        const node = new LinkedNode(el);
        let head = this.head;
        let index = 0;
        if (num > this.size) num = this.size;
        if (head === null) {
            this.head = node;
            this.size++;
            return;
        }
        while (head.next != null && index < num) {
            head = head.next;
            index++;
        }

        const next = head.next;
        head.next = node;
        head.next.next = next;
        this.size++;
    }

    deleteFrom(index: number) {
        if (index < 0 || index >= this.size)
            throw new TypeError("Invalid index provided to LinkedList");
        else {
            let curr,
                prev,
                it = 0;
            curr = this.head;
            prev = curr;

            if (curr === null) return;

            if (index === 0) {
                this.head = curr.next;
            } else {
                while (it < index) {
                    it++;
                    prev = curr;
                    curr = curr?.next;
                }
                //@ts-ignore
                prev.next = curr?.next;
            }
            this.size--;

            return curr?.value;
        }
    }

    indexOf(el: any) {
        let count = 0;
        let currentNode = this.head;

        while (currentNode != null) {
            if (isEqual(currentNode.value, el)) return count;
            count++;
        }

        return -1;
    }

    isEmpty() {
        return this.size === 0;
    }

    toArray() {
        const arr = [];
        let currentNode = this.head;

        while (currentNode != null) {
            arr.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return arr;
    }
}
