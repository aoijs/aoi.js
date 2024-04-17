const tsEs5FunctionRegex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*:\s*([a-zA-Z_$][0-9a-zA-Z_$]*)/;
const tsEs6FunctionRegex =
	/((?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*)?\(([^)]*)\)\s*:\s*([a-zA-Z_$][0-9a-zA-Z_$]*)/;
const jsDocRgex = /\/\*\*([\s\S]*?)\*\//g;

const primitiveTypes = ['string', 'number', 'boolean', 'void', 'null', 'undefined', 'never', 'any', 'unknown'];

const primitiveTypesLinks = {
	string: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
	number: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
	boolean: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
	void: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#void',
	null: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null',
	undefined: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
	never: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#never',
	any: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
	unknown: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown',
};

/*
type: {
	original: "number",
	parsed: "number",
	type: "primitive",
	name: "number",
	isCustom: false,
	body: [],
	link: "link to mdn number"
},
*/

const isObjectType = (type) => type.startsWith('{') && type.endsWith('}');
const isArrayType = (type) => type.endsWith('[]');

const isScopeOpenChar = (char) => char === '<' || char === '{' || char === '[' || char === '(';

const isScopeCloseChar = (char) => char === '>' || char === '}' || char === ']' || char === ')';

/**
 * parse typescript type
 * @param {string} type - type to parse
 * @typedef {{ original: string, parsed: string, type: string, name: string, isCustom: boolean, body: ParsedType[], link: string }} ParsedType
 * @returns {ParsedType} - parsed type
 */
const parseTsType = (type) => {
	const parsedType = {
		original: type,
		parsed: type,
		type: 'primitive',
		name: type,
		isCustom: false,
		body: [],
		link: '',
	};

	if (primitiveTypes.includes(type)) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		parsedType.link = primitiveTypesLinks[type];
	} else {
		parsedType.type = 'custom';
		parsedType.isCustom = true;

		// Record<string, string>

		let isInScope = false;
		let temp = '';
		let name = '';

		if (isObjectType(type)) {
			name = 'Object';
		}

		if (isArrayType(type)) {
			name = 'Array';
		}

		for (const char of type) {
			if (isScopeOpenChar(char)) {
				if (!name) name = temp;
				temp = '';
				// start of generic type
				isInScope = true;
			}

			if (isScopeCloseChar(char)) {
				// end of generic type
				isInScope = false;
			}

			if (char === ',' && isInScope) {
				if ((temp.startsWith('{') && temp.includes(':')) || (temp.includes(':') && temp.endsWith('}'))) {
					const [_key, value] = temp.split(':').map((x) => x.trim());

					let pvalue = value.replaceAll('{', '').replaceAll('}', '').trim();

					const parsed = parseTsType(pvalue);
					parsedType.body.push(parsed);
					temp = '';
				} else {
					const parsed = parseTsType(temp);
					parsedType.body.push(parsed);
					temp = '';
				}
			}

			temp += char;
		}

		if (temp) {
			if ((temp.startsWith('{') && temp.includes(':')) || (temp.includes(':') && temp.endsWith('}'))) {
				const [_key, value] = temp.split(':').map((x) => x.trim());

				let pvalue = value.replaceAll('{', '').replaceAll('}', '').trim();

				const parsed = parseTsType(pvalue);
				parsedType.body.push(parsed);
				temp = '';
			} else {
				const parsed = parseTsType(temp);
				parsedType.body.push(parsed);
				temp = '';
			}
		}

		parsedType.name = name;
	}

	return parsedType;
};

/**
 * parse ts params
 * @private
 * @param {string} params - params to parse
 * @returns {string[]} - parsed params
 */
const parseTsParams = (params) => {
	let inScope = false;
	const paramList = [];
	let temp = '';

	for (const char of params) {
		if (isScopeOpenChar(char)) inScope = true;
		if (isScopeCloseChar(char)) inScope = false;
		if (char === ',' && !inScope) {
			paramList.push(temp.trim());
			temp = '';
			continue;
		}

		temp += char;
	}

	if (temp) paramList.push(temp.trim());

	return paramList;
};

/**
 * extract es5 functions from code
 * @private
 * @param {string} code - code to extract functions from
 * @returns {{ startLine: string, functionName: string, params: { name: string, type: string }[], functionReturnType: string }} - extracted function
 */
const extractEs5Functions = (code) => {
	const functionLine = tsEs5FunctionRegex.exec(code);

	if (!functionLine) return [];

	const [startLine, functionName, functionParams, functionReturnType] = functionLine;
	const paramsList = parseTsParams(functionParams);
	const params = [];

	for (const param of paramsList) {
		const [name, ...type] = param.split(':').map((x) => x.trim());
		params.push({ name, type: type.join(':') });
	}

	return {
		startLine,
		functionName,
		params,
		functionReturnType,
	};
};

/**
 * extract es6 functions from code
 * @private
 * @param {string} code - code to extract functions from
 * @returns {{ startLine: string, functionName: string, params: { name: string, type: string }[], functionReturnType: string }} - extracted function
 */
const extractEs6Functions = (code) => {
	const functionLine = tsEs6FunctionRegex.exec(code);
	if (!functionLine) return [];

	const [startLine, _, functionName, functionParams, functionReturnType] = functionLine;

	const paramsList = parseTsParams(functionParams);
	const params = [];

	for (const param of paramsList) {
		const [name, ...type] = param.split(':').map((x) => x.trim());
		params.push({ name, type: type.join(':') });
	}

	return {
		startLine: startLine.trim(),
		functionName,
		params,
		functionReturnType,
	};
};

/**
 * check if code is es5 function
 * @private
 * @param {string} code - code to check
 * @returns {boolean} - is es5 function
 */
const isTsEs5Function = (code) => tsEs5FunctionRegex.test(code);

/**
 * extract ts functions from code
 * @param {string} code - code to extract functions from
 * @returns {{ startLine: string, functionName: string, params: { name: string, type: string }[], functionReturnType: string }[]} - extracted functions
 */
const extractTsFunctions = (code) => {
	if (isTsEs5Function(code)) {
		return extractEs5Functions(code);
	} else {
		return extractEs6Functions(code);
	}
};

/**
 * get jsdoc comments from code
 * @param {string} code - code to get jsdoc comments from
 * @returns {string} - jsdoc comment
 */
const getJsDocComment = (code) => {
	const jsDocComment = code.split('/**').pop().split('*/')[0].trim();
	if (!jsDocComment) return '';
	return jsDocComment;
};

const isWhiteSpace = (char) => char === ' ' || char === '\n' || char === '\t';

/**
 * get jsdoc tags from jsdoc comment
 * @param {string} jsDocComment - jsdoc comment
 * @returns {{ name: string, value: string | { name: string, content: string } }[]} - jsdoc tags
 */
const getJsDocTags = (jsDocComment) => {
	const tags = [];
	let tag = '';

	const description = jsDocComment.split('\n')[0].replaceAll('*', '').trim();
	tags.push({ name: 'description', value: description });

	let content = '';
	let currentlyStoringTag = 0;
	for (const char of jsDocComment.split('\n').slice(1).join('\n')) {
		if (char === '@') {
			if (currentlyStoringTag === 2) {
				if (tag === 'param') {
					const [name, body] = content.split('-').map((x) => x.replaceAll('*', '').trim());
					tags.push({ name: tag, value: { name, content: body } });
				} else {
					tags.push({ name: tag, value: content.replaceAll('*', '').trim() });
				}

				tag = '';
				content = '';
				currentlyStoringTag = 0;
			}

			currentlyStoringTag = 1;
			continue;
		}

		if (isWhiteSpace(char) && currentlyStoringTag === 1) {
			currentlyStoringTag = 2;
		}

		if (currentlyStoringTag === 1) {
			tag += char;
		} else if (currentlyStoringTag === 2) {
			content += char;
		}
	}

	return tags;
};

/**
 * generate ast from jsDoc comments
 * @param {string} code - code to generate ast from
 * @typedef {{ name: string, startLine: string, tags: { name: string, value: string | { name: string, content: string } }[] }} JSDocAST
 * @returns {JSDocAST[]} - generated ast
 */
const generateTypingAst = (code) => {
	// get all jsDoc comments
	const jsDocComments = code.match(jsDocRgex);
	const functions = [];

	for (const jsDocComment of jsDocComments) {
		const index = code.indexOf(jsDocComment);
		// get function just below the jsDocComment
		const functionCode = code.slice(index + jsDocComment.length);
		const functionData = extractTsFunctions(functionCode);

		const jsDoc = getJsDocComment(jsDocComment);
		const tags = getJsDocTags(jsDoc);

		for (const tag of tags) {
			if (tag.name === 'param') {
				const { name } = tag.value;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
				const param = functionData.params.find((x) => x.name === name);
				if (param) {
					tag.value.type = parseTsType(param.type);
				}
			}
		}

		const returnObject = {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			name: functionData.functionName,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			startLine: functionData.startLine,
			tags: tags,
		};

		functions.push(returnObject);
	}

	return functions;
};

const code = `
/**
 * returns the name of the person
 * @param name - name of the person
 * @param age - age of the person
 * @returns - the name of the person
 */
function getName(name: string, age: number): string {
	return name;
}

/**
 * returns the name of the person
 * @param options - options object
 * @returns - the name of the person
 */
function getName(options: { name: string, age: number }): string {
	return name
}
`;

const docs = generateTypingAst(code);

console.log(JSON.stringify(docs, null, 2));
