"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FieldTypeExamples_1 = require("./constants/FieldTypeExamples");
const toTitleCase_1 = require("./functions/toTitleCase");
function default_1(fn) {
    const str = new Array();
    str.push(`---\ntitle: ${fn.name}\n---`);
    str.push('');
    str.push((0, toTitleCase_1.toTitleCase)(fn.description));
    if (fn.requiredModules) {
        str.push('');
        str.push('### Required Modules');
        str.push('');
        str.push(fn.requiredModules.map(m => `- [${m.name}](${m.url})`).join('\n'));
    }
    if (fn.optionalModules) {
        str.push('');
        str.push('### Optional Modules');
        str.push('');
        str.push(fn.optionalModules.map(m => `- [${m.name}](${m.url})`).join('\n'));
    }
    str.push('');
    if (fn.fields) {
        str.push('### Function Information');
        str.push('');
        str.push(`| Name | Description | Type | Required |
|------|-------------|------|----------|`);
        for (const field of fn.fields) {
            str.push(`| ${field.rest ? `...` : ''}${field.name}${field.pointer !== undefined ? ` (${field.pointer})` : ""} | ${(0, toTitleCase_1.toTitleCase)(field.description)} | ${(0, toTitleCase_1.toTitleCase)(field.type)}    | ${field.required ? `Yes` : 'No'}      |`);
        }
        const enums = fn.fields.filter(c => c.type === 'ENUM');
        str.push('');
        for (const enu of enums) {
            str.push(`### Enum Possibilities for \`${enu.name}\``);
            for (const choice of enu.choices) {
                str.push(`- \`${choice[0]}\`<br>`);
            }
            str.push('');
        }
    }
    if (fn.returns) {
        str.push('### Returns');
        str.push(`\`\`\`${fn.nullable ? '?' : ""}${(0, toTitleCase_1.toTitleCase)(fn.returns)}\`\`\``);
        str.push('');
    }
    str.push('#### Function Usage');
    str.push('```php');
    if (fn.brackets) {
        if (!fn.optional) {
            str.push(`${fn.name}[${fn.fields?.map(c => c.name).join(';')}]`);
        }
        else {
            str.push(`${fn.name} or ${fn.name}[${fn.fields?.map(c => c.name).join(';')}]`);
        }
    }
    else {
        str.push(fn.name);
    }
    str.push('```');
    const examples = [
        fn.brackets ? `${fn.name}[${fn.fields?.map(c => FieldTypeExamples_1.ExampleTypes[c.type]).join(';')}]` : null,
        ...fn.examples ?? []
    ].filter(Boolean);
    if (examples.length) {
        str.push('#### Examples');
    }
    for (const e of examples) {
        str.push('```php');
        str.push(e);
        str.push('```');
        str.push('');
    }
    return str.join('\n');
}
exports.default = default_1;
/**
 * # $authorID

 Returns the executor of Author ID from the Client.

 ### Function Information

 | Type      | Method | Required |
 |-----------|--------|----------|
 | Snowflake | none    | false      |

 #### Function Usage

 ```php
 $authorID
 ```

 #### Function Example

 ```javascript
 ...
 ```
 */ 
//# sourceMappingURL=generateFunctionDocumentation.js.map