const a = [
	{
		name: 'getName',
		startLine: 'function getName(name: string, age: number): string',
		tags: [
			{
				name: 'description',
				value: 'returns the name of the person',
			},
			{
				name: 'param',
				value: {
					name: 'name',
					content: 'name of the person',
					type: {
						original: 'string',
						parsed: 'string',
						type: 'primitive',
						name: 'string',
						isCustom: false,
						body: [],
						link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
					},
				},
			},
			{
				name: 'param',
				value: {
					name: 'age',
					content: 'age of the person',
					type: {
						original: 'number',
						parsed: 'number',
						type: 'primitive',
						name: 'number',
						isCustom: false,
						body: [],
						link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
					},
				},
			},
		],
	},
	{
		name: 'getName',
		startLine:
			'function getName(options: { name: string, age: number }): string',
		tags: [
			{
				name: 'description',
				value: 'returns the name of the person',
			},
			{
				name: 'param',
				value: {
					name: 'options',
					content: 'options object',
					type: {
						original: '{ name:string, age:number }',
						parsed: '{ name:string, age:number }',
						type: 'custom',
						name: 'Object',
						isCustom: true,
						body: [
							{
								original: 'string',
								parsed: 'string',
								type: 'primitive',
								name: 'string',
								isCustom: false,
								body: [],
								link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
							},
							{
								original: 'number',
								parsed: 'number',
								type: 'primitive',
								name: 'number',
								isCustom: false,
								body: [],
								link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
							},
						],
						link: '',
					},
				},
			},
		],
	},
];

const typeScriptTypes = {
	string: 'string',
	number: 'number',
	boolean: 'boolean',
	array: 'array',
	object: 'object',
	function: 'function',
	any: 'any',
	null: 'null',
	undefined: 'undefined',
	void: 'void',
	never: 'never',
	unknown: 'unknown',
	enum: 'enum',
	interface: 'interface',
	typeAlias: 'type',
	union: 'union',
	intersection: 'intersection',
	tuple: 'tuple',
	indexedAccess: 'indexedAccess',
	conditional: 'conditional',
	infer: 'infer',
	templateLiteral: 'templateLiteral',
	templateLiteralType: 'templateLiteralType',
	importType: 'importType',
	indexedAccessType: 'indexedAccessType',
	mappedType: 'mappedType',
	partial: 'partial',
	required: 'required',
	readonly: 'readonly',
	record: 'record',
	exclude: 'exclude',
	extract: 'extract',
	nonNullable: 'nonNullable',
	returnType: 'returnType',
	generics: 'generics',
};

const primitiveTypes = [
	typeScriptTypes.string,
	typeScriptTypes.number,
	typeScriptTypes.boolean,
	typeScriptTypes.any,
	typeScriptTypes.null,
	typeScriptTypes.undefined,
	typeScriptTypes.void,
	typeScriptTypes.never,
	typeScriptTypes.unknown,
];

const primitiveLinks = {
	[typeScriptTypes.string]:
		'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
	[typeScriptTypes.number]:
		'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
	[typeScriptTypes.boolean]:
		'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
	[typeScriptTypes.any]:
		'https://www.typescriptlang.org/docs/handbook/basic-types.html#any',
	[typeScriptTypes.null]:
		'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null',
	[typeScriptTypes.undefined]:
		'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
	[typeScriptTypes.void]:
		'https://www.typescriptlang.org/docs/handbook/basic-types.html#void',
	[typeScriptTypes.never]:
		'https://www.typescriptlang.org/docs/handbook/basic-types.html#never',
	[typeScriptTypes.unknown]:
		'https://www.typescriptlang.org/docs/handbook/basic-types.html#unknown',
};

/**
 * @typedef {"description" | "param" | "returns" | "example" | "see" | "link" | "deprecated" | "since" | "version" | "author" | "todo" | "note" | "throws" | "emits" | "listens" | "fires" | "private" | "protected" | "public" | "internal" | "external" | "readonly" | "abstract" | "override" | "virtual" | "static" | "async" | "generator" | "deprecated" | "ignore" | "hide"} TsDocType
 * @typedef {{ name: string; value: object; type: TsDocType  }} TsDocTag
 * @typedef {{ original: string; parsed: string; type: "primitive" | "custom"; name: string; isCustom: boolean; body: object[]; link: string }} TsDocParamType
 * @typedef {{ argTypes: {name:string, type:string}[]; returnType: string; name: string; func: string }} ParsedFunction
 */

class TsDocNode {
	/**
	 * set the name of the node
	 * @param {string} name - the name of the node
	 * @method
	 * @memberof TsDocNode
	 * @returns {TsDocNode} - the current instance
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	/**
	 * set the start line of the node
	 * @param {string} startLine - the start line of the node
	 * @method
	 * @memberof TsDocNode
	 * @returns {TsDocNode} - the current instance
	 */
	setStartLine(startLine) {
		this.startLine = startLine;
		return this;
	}

	/**
	 * set the tags of the node
	 * @param {TsDocTag[]} tags - the tags of the node
	 * @method
	 * @memberof TsDocNode
	 * @returns {TsDocNode} - the current instance
	 */
	setTags(tags) {
		this.tags = tags;
		return this;
	}

	/**
	 * adds a new tag to the node
	 * @param {TsDocTag} tag - the tag to add
	 * @method
	 * @memberof TsDocNode
	 * @returns {TsDocNode} - the current instance
	 */
	addTag(tag) {
		this.tags.push(tag);
		return this;
	}

	/**
	 * build the node
	 * @method
	 * @memberof TsDocNode
	 * @returns {object} - the node
	 */
	build() {
		return {
			name: this.name,
			startLine: this.startLine,
			tags: this.tags,
		};
	}
}

/**
 * @class
 * @classdesc Class to extract documentation from TypeScript files
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
class ExtractFromTS {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly
	#primitiveTypes;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly
	#primitiveLinks;
	/**
	 * create a new instance of ExtractFromTS
	 * @constructor
	 * @param {object} options - the options
	 * @param {string[]} [options.primitiveTypes] - the primitive types
	 * @param {object} [options.primitiveLinks] - the primitive links
	 */
	constructor() {
		this.#primitiveTypes = primitiveTypes;
		this.#primitiveLinks = primitiveLinks;
	}

	/**
	 * extract the documentation from a TypeScript file
	 * @param {string} content - the content of the file
	 * @returns {TsDocNode[]} - the documentation nodes
	 */
	extract(content) {
		const comments = this.#getTsDocComments(content);
		const nodes = [];
		for (const comment of comments) {
			const functionBelowComment = this.#getFunctionBelowComment(
				comment,
				content,
			);
			const parsedFunction = this.#parseFunctionTypes(functionBelowComment);
			const tags = this.#getTagsFromComment(
				comment,
				functionBelowComment,
			);
			const node = new TsDocNode()
				.setName(parsedFunction.name)
				.setStartLine(parsedFunction.func)
				.setTags(tags);

			nodes.push(node);
		}

		return nodes;
	}

	/**
	 * get the comments from the content
	 * @param {string} content - the content of the file
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {string[]}
	 */
	#getTsDocComments(content) {
		const tsDocCommentRegex = /\/\*\*[\s\S]*?\*\//g;
		const comments = content.match(tsDocCommentRegex);
		return comments ?? [];
	}

	/**
	 * get function below the comment
	 * @param {string} comment - the comment
	 * @param {string} content - the content of the file
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {string[]} - the function
	 */
	#getFunctionBelowComment(comment, content) {
		const commentIndex = content.indexOf(comment);
		const contentBelowComment = content
			.substring(commentIndex + comment.length)
			.trim();
		// es5 & es6 function
		const functionRegex =
		/function\s+(\w+)\s*\(([^)]*)\)\s*:\s*({[^}]*}|[\w\s\[\]\|<>.,]+)\s*{[^}]*}/g;

		const match = functionRegex.exec(contentBelowComment);
		return match ?? [];
	}

	/**
	 * get the tags from a comment
	 * @param {string} comment - the comment
	 * @param {string[]} functionBelowComment - the function below the comment
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {TsDocTag[]}
	 */
	#getTagsFromComment(comment, functionBelowComment) {
		const tags = [];
		const tagRegex = /@(\w+)\s*([\s\S]*?)(?=(?:\s*@|$))/g;
		let match;
		const getFunctionTypes = this.#parseFunctionTypes(functionBelowComment);
		while ((match = tagRegex.exec(comment))) {
			const [_, name, value] = match;
			const parsedValue = this.#parseTag({
				tagName: name,
				tagValue: value,
				functionTypes: getFunctionTypes,
			});
			tags.push({ name, value: parsedValue });
		}

		return tags;
	}

	/**
	 * parse a tag
	 * @param {object} tag - the tag
	 * @param {string} tag.tagName - the tag name
	 * @param {string} tag.tagValue - the tag value
	 * @param {ParsedFunction} tag.functionTypes - the function types
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {object | null} - the parsed tag
	 */
	#parseTag({ tagName, tagValue, functionTypes }) {
		if (tagName === 'param') {
			return this.#parseParamTag(tagValue, functionTypes);
		} else if (tagName === 'returns') {
			return this.#parseReturnsTag(tagValue, functionTypes);
		} else if (tagName === 'example') {
			// return this.#parseExampleTag(tagValue);
		}
	}

	/**
	 * parse a param tag
	 * @param {string} tagValue - the tag value
	 * @param {object} functionTypes - the function types
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {object | null} - the parsed tag
	 */
	#parseParamTag(tagValue, functionTypes) {
		// @param name - description
		const paramTagRegex = /(\w+)\s*-\s*(.*)/;
		const match = paramTagRegex.exec(tagValue);
		if (!match) {
			return null;
		}

		const [_, name, content] = match;
		const type = this.#getParamType(name, functionTypes);
		return { name, content, type };
	}

	/**
	 * parse a returns tag
	 * @param {string} tagValue - the tag value
	 * @param {ParsedFunction} functionTypes - the function types
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {object | null} - the parsed tag
	 */
	#parseReturnsTag(tagValue, functionTypes) {
		return this.#parseType(functionTypes.returnType);	
	}

	/**
	 * parse the types of the function
	 * @param {string[]} functionBelowComment - the function below the comment
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {ParsedFunction} - the parsed types
	 */
	#parseFunctionTypes(functionBelowComment) {
		const arg = functionBelowComment[2];
		const returnType = functionBelowComment[3];
		const name = functionBelowComment[1];
		const func = `${name}(${arg}): ${returnType}`;
		const argTypes = this.#parseArgTypes(arg);

		return {
			argTypes,
			returnType,
			name,
			func,
		};
	}

	/**
	 * parse the types of the arguments
	 * @param {string} args - the arguments
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {object[]} - the parsed types
	 */
	#parseArgTypes(args) {
		const argTypes = [];
		const argRegex = /(\w+)\s*:\s*([\s\S]*?)(?=(?:,\s*|$))/g;
		let match;
		while ((match = argRegex.exec(args))) {
			const [_, name, type] = match;
			argTypes.push({ name, type });
		}

		return argTypes;
	}

	/**
	 * get the type of the param
	 * @param {string} name - the name of the param
	 * @param {{ argTypes: {name:string, type:string}[]; returnType: string }} functionTypes - the function types
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {object} - the type
	 */
	#getParamType(name, functionTypes) {
		const argType = functionTypes.argTypes.find((arg) => arg.name === name);
		if (argType) {
			return this.#parseType(argType.type);
		}

		return this.#parseType(functionTypes.returnType);
	}

	/**
	 * parse the type into a type object
	 * @param {string} type - the type
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {TsDocParamType} - the type object
	 */
	#parseType(type) {
		if (this.#primitiveTypes.includes(type)) {
			const parsedType = '#ROOT#';
			return {
				original: type,
				parsed: parsedType,
				type: 'primitive',
				name: type,
				isCustom: false,
				body: [],
				link: this.#primitiveLinks[type],
			};
		}

		const customTypeRegex = /{([^}]*)}/;
		const customTypeMatch = customTypeRegex.exec(type);

		if (customTypeMatch) {
			const customType = customTypeMatch[1];
			const customTypeParts = customType
				.split(',')
				.map((part) => part.trim().split(':'));
			const body = customTypeParts.map((part) => part[1].trim() ? this.#parseType(part[1].trim()) : this.#parseType(part[0].trim()));
			// original: '{ name:string, age:number }' -> parsed: '{ name:#CHILD_0#, age:#CHILD_1# }'

			const parsedType = customTypeParts.reduce(
				(acc, part, index) => acc.replace(part[1]?.trim() ?? part[0].trim(), `#CHILD_${index}#`),
				type,
			);
			return {
				original: type,
				parsed: parsedType,
				type: 'custom',
				name: 'Object',
				isCustom: true,
				body,
				link: '',
			};
		}

		return {
			original: type,
			parsed: type,
			type: 'custom',
			name: 'Object',
			isCustom: true,
			body: [],
			link: '',
		};
	}

	/**
	 * detect ts type
	 * @param {string} type - the type
	 * @method
	 * @memberof ExtractFromTS
	 * @private
	 * @returns {string} - the type
	 */
}

const code = `
/**
 * returns the name of the person
 * @param name - name of the person
 * @param age - age of the person
 * @example
 * \`\`\`js
 * const name = getName('John', 30);
 * \`\`\`
 * @returns the name of the person
 */
function getName(name: string, age: number): ParsedData {
	return { name, age };
}
`;

const extractFromTs = new ExtractFromTS();
const nodes = extractFromTs.extract(code);
console.log(JSON.stringify(nodes, null, 2));
