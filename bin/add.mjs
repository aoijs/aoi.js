import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import addLicense from './addLicense.mjs';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const folderStructure = (lib) => [
	{
		name: 'src',
		type: 'dir',
		children: [
			{
				name: 'index.ts',
				type: 'file',
				content: `function log(message: string) {
	console.log(message);
}

export default log;`,
			},
		],
	},
	{
		name: 'tests',
		type: 'dir',
		children: [
			{
				name: 'index.test.ts',
				type: 'file',
				content: `import log from '../src/index.js';
		
test('log', () => {
	const spy = jest.spyOn(console, 'log');
	log('hello');
	expect(spy).toHaveBeenCalledWith('hello');
});`,
			},
		],
	},
	{
		name: 'package.json',
		type: 'file',
		content: `{
  "name": "@aoijs/${lib}",
  "version": "0.0.1",
  "description": "@aoijs/${lib} - A Extension for Aoi.js",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "types": "dist/types/index.d.ts",
  "type": "commonjs",
  "exports": {
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js",
	"types": "./dist/types/index.d.ts"
  },
  "engines": {
    "node": ">=20.x"
  },
  "license": "MIT",
  "keywords": [
    "aoi.db",
    "${lib}",
    "dbd.js",
    "dbdjs",
    "dbd",
    "aoi.js",
    "aoi",
    "discord"
  ],
  "files": [
    "dist",
    "package.json",
    "README.md"
  ],
  "homepage": "",
  "repository": {
    "type": "git",
    "url": "https://github.com/Aoijs/aoi.js"
  },
  "author": "Leref",
  "maintainers": [
    "USERSATOSHI"
  ],
  "bugs": {
    "url": "https://github.com/Aoijs/aoi.js/issues"
  },
  "readme": "https://github.com/Aoijs/aoi.js/blob/main/README.md"
}`,
	},
	{
		name: 'tsconfig.json',
		type: 'file',
		content: `{
	"extends": "../../tsconfig.json",
	"include": ["./src/**/*.ts"],
	"compilerOptions": {
		/* Visit https://aka.ms/tsconfig to read more about this file */

		/* Projects */
		"incremental": true /* Save .tsbuildinfo files to allow for incremental compilation of projects. */,
		"composite": true /* Enable constraints that allow a TypeScript project to be used with project references. */,
		"tsBuildInfoFile": "./.tsbuildinfo" /* Specify the path to .tsbuildinfo incremental compilation file. */,
		// "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
		// "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
		// "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

		/* Language and Environment */
		"target": "ESNext" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
		// "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
		// "jsx": "preserve",                                /* Specify what JSX code is generated. */
		// "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
		// "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
		// "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
		// "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
		// "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
		// "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
		// "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
		// "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
		// "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

		/* Modules */
		"module": "CommonJS" /* Specify what module code is generated. */,
		"moduleResolution": "node10" /* Specify how TypeScript looks up a file from a given module specifier. */,
		"baseUrl": "." /* Specify the base directory to resolve non-relative module names. */,
		"paths": {
			"@${lib}/*": ["./src/*"],
			"@aoirepo/*": ["../../*"]
		} /* Specify a set of entries that re-map imports to additional lookup locations. */,
		// "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
		"rootDir": "./src" /* Specify the root folder within your source files. */,
		// "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
		// "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
		// "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
		// "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
		"allowImportingTsExtensions": false,               /* Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. */
		// "resolvePackageJsonExports": true,                /* Use the package.json 'exports' field when resolving package imports. */
		// "resolvePackageJsonImports": true,                /* Use the package.json 'imports' field when resolving imports. */
		// "customConditions": [],                           /* Conditions to set in addition to the resolver-specific defaults when resolving imports. */
		// "resolveJsonModule": true,                        /* Enable importing .json files. */
		// "allowArbitraryExtensions": true,                 /* Enable importing files with any extension, provided a declaration file is present. */
		// "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

		/* JavaScript Support */
		"allowJs": false,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
		"checkJs": false,                                  /* Enable error reporting in type-checked JavaScript files. */
		// "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */

		/* Emit */
		"declaration": true /* Generate .d.ts files from TypeScript and JavaScript files in your project. */,
		// "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
		// "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
		// "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
		// "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
		// "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
		"outDir": "./dist",                                   /* Specify an output folder for all emitted files. */
		// "removeComments": true,                           /* Disable emitting comments. */
		"noEmit": false,                                   /* Disable emitting files from a compilation. */
		// "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
		// "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
		// "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
		// "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
		// "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
		// "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
		// "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
		// "newLine": "crlf",                                /* Set the newline character for emitting files. */
		// "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
		// "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
		// "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
		// "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
		"declarationDir": "./dist/types",                           /* Specify the output directory for generated declaration files. */
		// "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

		/* Interop Constraints */
		// "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
		// "verbatimModuleSyntax": true,                     /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
		// "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
		"esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
		// "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
		"forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

		/* Type Checking */
		"strict": true /* Enable all strict type-checking options. */,
		// "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
		// "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
		// "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
		// "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
		// "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
		// "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
		// "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
		// "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
		// "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
		// "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
		// "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
		// "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
		// "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
		// "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
		// "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
		// "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
		// "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
		// "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

		/* Completeness */
		// "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
		"skipLibCheck": true /* Skip type checking all .d.ts files. */
	},
	"exclude": ["coverage","node_modules"]
}
`,
	},
	{
		name: 'tsconfig.cjs.json',
		type: 'file',
		content: `{
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"target": "ESNext",
		"module": "CommonJS",
		"moduleResolution": "Node10",
		"outDir": "./dist/cjs",
		"declaration": true,
		// "declarationMap": true,
		// "sourceMap": true,
		"composite": true,
		"tsBuildInfoFile": "./dist/cjs/.tsbuildinfo",
		"incremental": true
	},
}`,
	},
	{
		name: 'tsconfig.esm.json',
		type: 'file',
		content: `{
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"target": "ESNext",
		"module": "NodeNext",
		"moduleResolution": "NodeNext",
		"outDir": "./dist/esm",
		"declaration": true,
		// "declarationMap": true,
		// "sourceMap": true,
		"composite": true,
		"tsBuildInfoFile": "./dist/esm/.tsbuildinfo",
		"incremental": true
	},
}`,
	},
	{
		name: 'tsconfig.eslint.json',
		type: 'file',
		content: `{
	"$schema": "https://json.schemastore.org/tsconfig.json",
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"allowJs": true
	},
	"include": [
		"*.ts",
		"*.js",
		"*.cjs",
		"*.mjs",
		"src/**/*.ts",
		"src/**/*.js",
		"src/**/*.cjs",
		"src/**/*.mjs",
		"__tests__"
	],
	"exclude": ["node_modules"]
}`,
	},
	{
		name: 'README.md',
		type: 'file',
		content: `# @aoijs/${lib}

A Extension for Aoi.js
`,
	},
	{
		name: '.gitignore',
		type: 'file',
		content: `node_modules
dist
coverage
`,
	},
	{
		name: '.npmignore',
		type: 'file',
		content: `node_modules
src
coverage
`,
	},
	{
		name: 'LICENSE',
		type: 'file',
		content: `
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction,
and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by
the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all
other entities that control, are controlled by, or are under common
control with that entity. For the purposes of this definition,
"control" means (i) the power, direct or indirect, to cause the
direction or management of such entity, whether by contract or
otherwise, or (ii) ownership of fifty percent (50%) or more of the
outstanding shares, or (iii) beneficial ownership of such entity.

"You" (or "Your") shall mean an individual or Legal Entity
exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications,
including but not limited to software source code, documentation
source, and configuration files.

"Object" form shall mean any form resulting from mechanical
transformation or translation of a Source form, including but
not limited to compiled object code, generated documentation,
and conversions to other media types.

"Work" shall mean the work of authorship, whether in Source or
Object form, made available under the License, as indicated by a
copyright notice that is included in or attached to the work
(an example is provided in the Appendix below).

"Derivative Works" shall mean any work, whether in Source or Object
form, that is based on (or derived from) the Work and for which the
editorial revisions, annotations, elaborations, or other modifications
represent, as a whole, an original work of authorship. For the purposes
of this License, Derivative Works shall not include works that remain
separable from, or merely link (or bind by name) to the interfaces of,
the Work and Derivative Works thereof.

"Contribution" shall mean any work of authorship, including
the original version of the Work and any modifications or additions
to that Work or Derivative Works thereof, that is intentionally
submitted to Licensor for inclusion in the Work by the copyright owner
or by an individual or Legal Entity authorized to submit on behalf of
the copyright owner. For the purposes of this definition, "submitted"
means any form of electronic, verbal, or written communication sent
to the Licensor or its representatives, including but not limited to
communication on electronic mailing lists, source code control systems,
and issue tracking systems that are managed by, or on behalf of, the
Licensor for the purpose of discussing and improving the Work, but
excluding communication that is conspicuously marked or otherwise
designated in writing by the copyright owner as "Not a Contribution."

"Contributor" shall mean Licensor and any individual or Legal Entity
on behalf of whom a Contribution has been received by Licensor and
subsequently incorporated within the Work.

2. Grant of Copyright License. Subject to the terms and conditions of
this License, each Contributor hereby grants to You a perpetual,
worldwide, non-exclusive, no-charge, royalty-free, irrevocable
copyright license to reproduce, prepare Derivative Works of,
publicly display, publicly perform, sublicense, and distribute the
Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of
this License, each Contributor hereby grants to You a perpetual,
worldwide, non-exclusive, no-charge, royalty-free, irrevocable
(except as stated in this section) patent license to make, have made,
use, offer to sell, sell, import, and otherwise transfer the Work,
where such license applies only to those patent claims licensable
by such Contributor that are necessarily infringed by their
Contribution(s) alone or by combination of their Contribution(s)
with the Work to which such Contribution(s) was submitted. If You
institute patent litigation against any entity (including a
cross-claim or counterclaim in a lawsuit) alleging that the Work
or a Contribution incorporated within the Work constitutes direct
or contributory patent infringement, then any patent licenses
granted to You under this License for that Work shall terminate
as of the date such litigation is filed.

4. Redistribution. You may reproduce and distribute copies of the
Work or Derivative Works thereof in any medium, with or without
modifications, and in Source or Object form, provided that You
meet the following conditions:

(a) You must give any other recipients of the Work or
Derivative Works a copy of this License; and

(b) You must cause any modified files to carry prominent notices
stating that You changed the files; and

(c) You must retain, in the Source form of any Derivative Works
that You distribute, all copyright, patent, trademark, and
attribution notices from the Source form of the Work,
excluding those notices that do not pertain to any part of
the Derivative Works; and

(d) If the Work includes a "NOTICE" text file as part of its
distribution, then any Derivative Works that You distribute must
include a readable copy of the attribution notices contained
within such NOTICE file, excluding those notices that do not
pertain to any part of the Derivative Works, in at least one
of the following places: within a NOTICE text file distributed
as part of the Derivative Works; within the Source form or
documentation, if provided along with the Derivative Works; or,
within a display generated by the Derivative Works, if and
wherever such third-party notices normally appear. The contents
of the NOTICE file are for informational purposes only and
do not modify the License. You may add Your own attribution
notices within Derivative Works that You distribute, alongside
or as an addendum to the NOTICE text from the Work, provided
that such additional attribution notices cannot be construed
as modifying the License.

You may add Your own copyright statement to Your modifications and
may provide additional or different license terms and conditions
for use, reproduction, or distribution of Your modifications, or
for any such Derivative Works as a whole, provided Your use,
reproduction, and distribution of the Work otherwise complies with
the conditions stated in this License.

5. Submission of Contributions. Unless You explicitly state otherwise,
any Contribution intentionally submitted for inclusion in the Work
by You to the Licensor shall be under the terms and conditions of
this License, without any additional terms or conditions.
Notwithstanding the above, nothing herein shall supersede or modify
the terms of any separate license agreement you may have executed
with Licensor regarding such Contributions.

6. Trademarks. This License does not grant permission to use the trade
names, trademarks, service marks, or product names of the Licensor,
except as required for reasonable and customary use in describing the
origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty. Unless required by applicable law or
agreed to in writing, Licensor provides the Work (and each
Contributor provides its Contributions) on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied, including, without limitation, any warranties or conditions
of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
PARTICULAR PURPOSE. You are solely responsible for determining the
appropriateness of using or redistributing the Work and assume any
risks associated with Your exercise of permissions under this License.

8. Limitation of Liability. In no event and under no legal theory,
whether in tort (including negligence), contract, or otherwise,
unless required by applicable law (such as deliberate and grossly
negligent acts) or agreed to in writing, shall any Contributor be
liable to You for damages, including any direct, indirect, special,
incidental, or consequential damages of any character arising as a
result of this License or out of the use or inability to use the
Work (including but not limited to damages for loss of goodwill,
work stoppage, computer failure or malfunction, or any and all
other commercial damages or losses), even if such Contributor
has been advised of the possibility of such damages.

9. Accepting Warranty or Additional Liability. While redistributing
the Work or Derivative Works thereof, You may choose to offer,
and charge a fee for, acceptance of support, warranty, indemnity,
or other liability obligations and/or rights consistent with this
License. However, in accepting such obligations, You may act only
on Your own behalf and on Your sole responsibility, not on behalf
of any other Contributor, and only if You agree to indemnify,
defend, and hold each Contributor harmless for any liability
incurred by, or claims asserted against, such Contributor by reason
of your accepting any such warranty or additional liability.

END OF TERMS AND CONDITIONS

Copyright ${new Date().getFullYear()} Akarui Development

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
`,
	},
	{
		name: '.swcrc',
		type: 'file',
		content: `{
	"$schema": "https://swc.rs/schema.json",
	"module": {
		"type": "es6",
		"resolveFully": true
	},
	"jsc": {
	  "parser": {
		"syntax": "typescript",
		"jsx": false,
		"dynamicImport": true,
		"privateMethod": true,
		"functionBind": true,
		"exportDefaultFrom": true,
		"exportNamespaceFrom": true,
		"decorators": true,
		"decoratorsBeforeExport": true,
		"topLevelAwait": true,
		"importMeta": true
	  },
	  "target": "esnext",
	  "baseUrl": "./",
	  "paths": {
		"@${lib}/*": ["./src/*"],
		"@aoirepo/*": ["../../*"]
	  },
	  "loose": false,
	  "externalHelpers": false,
	  // Requires v1.2.50 or upper and requires target to be es2016 or upper.
	  "keepClassNames": true,
	  "preserveAllComments": true
	},
	"minify": false
  }`,
	},
];

/**
 * walks the structure and creates the files and folders
 * @private
 * @param { {name: string, type: 'dir' | 'file', children?: any[], content?: string}[] } structure - the structure to walk
 * @param {string} currentPath - the current path
 * @param {number} indent - the indentation level
 * @returns {Promise<void>}
 */
const walkAndBuild = async (structure, currentPath, indent = 4) => {
	for (const fileOrDir of structure) {
		let spinner = ora({
			text: `Resolving ${fileOrDir.name}`,
			color: 'yellow',
			spinner: 'dots',
			indent,
		}).start();
		const fullPath = path.resolve(currentPath, fileOrDir.name);
		spinner.succeed();

		if (fileOrDir.type === 'dir') {
			spinner = ora({
				text: `Building directory ${fileOrDir.name}`,
				color: 'yellow',
				spinner: 'dots',
				indent,
			}).start();
			await fs.mkdir(fullPath);

			await walkAndBuild(fileOrDir.children, fullPath, indent * 2);

			spinner.succeed();
		} else {
			spinner = ora({
				text: `Creating file ${fileOrDir.name}`,
				color: 'yellow',
				spinner: 'dots',
				indent,
			}).start();
			await fs.writeFile(fullPath, fileOrDir.content);
			spinner.succeed();
		}
	}
};

/**
 * adds a new library to the project
 * @param {object} options - the options object
 * @param {string} options.library - the name of the library to add
 * @returns {Promise<void>}
 */
const add = async ({ library }) => {
	const spinner = ora({
		text: `Adding ${library}`,
		color: 'yellow',
		spinner: 'dots',
		indent: 1,
	}).start();
	const structure = folderStructure(library);

	let spinner2 = ora({
		text: 'Resolving library path',
		color: 'yellow',
		spinner: 'dots',
		indent: 4,
	}).start();
	const libraryPath = path.resolve(__dirname, '../lib', library);
	spinner2.succeed();

	spinner2 = ora({
		text: 'Creating library folder',
		color: 'yellow',
		spinner: 'dots',
		indent: 4,
	}).start();

	await fs.mkdir(libraryPath);
	spinner2.succeed();

	spinner2 = ora({
		text: 'Building library structure',
		color: 'yellow',
		spinner: 'dots',
		indent: 4,
	}).start();
	await walkAndBuild(structure, libraryPath);
	spinner2.succeed();

	await addLicense({ library });

	spinner.succeed();
};

export default add;
