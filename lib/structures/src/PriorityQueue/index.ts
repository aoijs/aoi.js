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

const _top = 0;
const _parent = (i: number) => ((i + 1) >>> 1) - 1;
const _left = (i: number) => (i << 1) + 1;
const _right = (i: number) => (i + 1) << 1;

export default class PriorityQueue {
  _heap: any[];
  _comparator: (a: any, b: any) =>  number;
  _keyMap: Map<any, number>;
  constructor(comparator = (a: any, b: any) => ((a < b) as unknown as number)) { 
    this._heap = [];
    this._comparator = comparator;
    this._keyMap = new Map();
  }

  clear() {
	this._heap = [];
	this._keyMap.clear();
  }

  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[_top];
  }
  push(...values: any[]) {
    values.forEach((value) => {
      this._heap.push(value);
      this._keyMap.set(value, this.size() - 1);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > _top) {
      this._swap(_top, bottom);
      this._keyMap.set(this._heap[_top], _top);
      this._keyMap.delete(this._heap[bottom]);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  findIndex(value: any): number {
    const index = this._keyMap.get(value);
    return index === undefined ? -1 : index;
  }
  findFromProp(retrievingFunction: (a: any) => boolean): number {
    return this._findFromPropRecursive(retrievingFunction, _top);
  }

  private _findFromPropRecursive(
    retrievingFunction: (a: any) => boolean,
    node: number
  ): number {
    if (node >= this._heap.length) {
      return -1; // Value not found
    }

    if (retrievingFunction(this._heap[node])) {
      return node; // Value found
    }

    const leftIndex = this._findFromPropRecursive(
      retrievingFunction,
      _left(node)
    );
    if (leftIndex !== -1) {
      return leftIndex; // Value found in the left subtree
    }

    const rightIndex = this._findFromPropRecursive(
      retrievingFunction,
      _right(node)
    );
    if (rightIndex !== -1) {
      return rightIndex; // Value found in the right subtree
    }

    return -1; // Value not found
  }

  replace(value: any) {
    const replacedValue = this.peek();
    this._heap[_top] = value;
    this._siftDown();
    return replacedValue;
  }

  replaceFromProp(value: any, replacingFunction: (a: any) => boolean): void {
    const index = this._findFromPropRecursive(replacingFunction, 0);
    if (index !== -1) {
      this._heap[index] = value;
      this._keyMap.delete(this._heap[index].key);
      this._keyMap.set(value, index);
      this._siftUp();
      this._siftDown();
    }
  }

 
  private _greater(i: number, j: number) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  private _swap(i: number, j: number) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  private _siftUp() {
    let node = this.size() - 1;
    while (node > _top && this._greater(node, _parent(node))) {
      this._swap(node, _parent(node));
      this._keyMap.set(this._heap[node], node);
      this._keyMap.set(this._heap[_parent(node)], _parent(node));
      node = _parent(node);
    }
  }
  private _siftDown() {
    let node = _top;
    while (
      (_left(node) < this.size() && this._greater(_left(node), node)) ||
      (_right(node) < this.size() && this._greater(_right(node), node))
    ) {
      let maxChild =
        _right(node) < this.size() && this._greater(_right(node), _left(node))
          ? _right(node)
          : _left(node);
      this._swap(node, maxChild);
      this._keyMap.set(this._heap[node], node);
      this._keyMap.set(this._heap[maxChild], maxChild);
      node = maxChild;
    }
  }
  remove(value: any) {
    const index = this._keyMap.get(value);
    if (index !== undefined) {
      this._heap.splice(index, 1);
      this._keyMap.delete(value);
      this._siftDown();
      this._siftUp();
    }
  }
  removeByProp(retrievingFunction: (a: any) => boolean) {
    const index = this._findFromPropRecursive(retrievingFunction, 0);
    if (index !== -1) {
      this._heap.splice(index, 1);
      this._keyMap.delete(this._heap[index]);
      this._siftDown();
      this._siftUp();
    }
  }
}
