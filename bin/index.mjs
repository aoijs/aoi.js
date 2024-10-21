#!/usr/bin/env -S node --no-warnings=ExperimentalWarning

import { program } from 'commander';
import test from './test.mjs';
import build from './build.mjs';
import publish from './publish.mjs';
import version from './version.mjs';
import docs from './docs.mjs';
import pkg from './package.json' assert { type: 'json' };
import chalk from 'chalk';
import add from './add.mjs';
import addLicense from './addLicense.mjs';
import run from './run.mjs';

program
	.command('test')
	.description('run all tests for the given library')
	.requiredOption('-l, --library <library>', 'the library to test')
	.option('-f, --folder <folder>', 'the folder to test in the library')
	.action(test);

program
	.command('build')
	.description('build the given library')
	.requiredOption('-l, --library <library>', 'the library to build')
	.action(build);

program
	.command('publish')
	.description('publish the given library')
	.requiredOption('-l, --library <library>', 'the library to publish')
	.action(publish);

program
	.command('version')
	.description('increment the version of the given library')
	.requiredOption('-l, --library <library>', 'the library to version')
	.requiredOption('-s, --semver <semver>', 'the semver version to increment')
	.action(version);

program
	.command('docs')
	.description('generate the documentation for the given library')
	.requiredOption('-l, --library <library>', 'the library to document')
	.action(docs);

program
	.command('add')
	.description('add a new library')
	.requiredOption('-l, --library <library>', 'the library to add')
	.action(add);

program
	.command('addLicense')
	.description('add a license to the given library')
	.requiredOption('-l, --library <library>', 'the library to license')
	.action(addLicense);

program
	.command('run')
	.description('run a file for the given library')
	.requiredOption('-l, --library <library>', 'the library to run')
	.requiredOption('-f, --file <file>', 'the file to run')
	.action(run);

program
	.name(pkg.name)
	.version(pkg.version)
	.description(pkg.description)
	.addHelpText(
		'after',
		`
${chalk.bold('Examples:')}
  > ${pkg.name} test -l my-library
  > ${pkg.name} build -l my-library
  > ${pkg.name} publish -l my-library
  > ${pkg.name} version -l my-library -s patch
  > ${pkg.name} docs -l my-library
  > ${pkg.name} add -l my-library
`,
	);

program.parse(process.argv);
