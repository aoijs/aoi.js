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

export function valueOf(data: any) {
    return data.valueOf ? data.valueOf() : Object.prototype.valueOf.call(data);
}

function isEqual(a: any, b: any):boolean {
    if (a === b) return true;

    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
        return (
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((item, index) => isEqual(item, b[index]))
        );
    }

    if (typeof a === "object" || typeof b === "object") {
        var aValue = valueOf(a);
        var bValue = valueOf(b);

        if (aValue !== a || bValue !== b) isEqual(aValue, bValue);

        return Object.keys(Object.assign({}, a, b)).every((key) =>
            isEqual(a[key], b[key]),
        );
    }

    return false;
}

export default isEqual;
