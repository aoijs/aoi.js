import fs from 'fs';
import path from 'path';

/**
 * Extract metadata from aoijs' function TypeScript file
 * @param {string} filePath - The path to the TypeScript file
 * @returns {object} - The extracted metadata
 */
function extractMetadata(filePath) {
	// Read the TypeScript file
	const tsFileContent = fs.readFileSync(filePath, 'utf-8');

	// Extract metadata using regular expressions
	const metadata = {};

	// Extract function name
	const nameMatch = /\.setName\(['"`](.*?)['"`]\)/.exec(tsFileContent);
	if (nameMatch) metadata.name = nameMatch[1];

	// Extract brackets
	const bracketsMatch = /\.setBrackets\((.*?)\)/.exec(tsFileContent);
	if (bracketsMatch) metadata.brackets = bracketsMatch[1] === 'true';

	// Extract optional
	const optionalMatch = /\.setOptional\((.*?)\)/.exec(tsFileContent);
	if (optionalMatch) metadata.optional = optionalMatch[1] === 'true';

	// Extract function type
	const typeMatch = /\.setType\((.*?)\)/.exec(tsFileContent);
	if (typeMatch) metadata.type = typeMatch[1].replace('FunctionType.', '');

	// Extract fields
	const fieldsMatch = /\.setFields\((.*?)\)/s.exec(tsFileContent);
	if (fieldsMatch) {
		const fields = fieldsMatch[1].split('],').map((field) => {
			const fieldData = field.replace(/[\[\]']/g, '').split(',');
			const name = fieldData
				.find((data) => data.includes('name:'))
				.split(':')[1]
				.trim();
			const description = fieldData
				.find((data) => data.includes('description:'))
				.split(':')[1]
				.trim();
			const type = fieldData
				.find((data) => data.includes('type:'))
				.split(':')[1]
				.split('.')[1]
				.trim();
			const required =
				fieldData
					.find((data) => data.includes('required:'))
					.split(':')[1]
					.trim() === 'true';

			return {
				name,
				description,
				type,
				required,
			};
		});
		metadata.fields = fields;
	}

	// Extract return type
	const returnTypeMatch = /\.setReturns\((.*?)\)/.exec(tsFileContent);
	if (returnTypeMatch)
		metadata.returns = returnTypeMatch[1].replace('ReturnType.', '');

	return metadata;
}

// Usage example
const filePath = path.join(
	process.cwd() + '/lib/aoi.js/src/functions/js/conditions/$and.ts',
);
const metadata = extractMetadata(filePath);
console.log(metadata);
