import { AoiJSFunction } from '../../../structures/AoiJSFunction.js';
import { escapeMathResult, parseResult } from '../../../util/transpilerHelpers.js';
const abs = new AoiJSFunction()
  .setName('$abs')
  .setType('getter')
  .setBrackets(true)
  .setOptional(false)
  .setField(
    {
      name: 'number',
      type: 'number',
      description: 'The number to get the absolute value from',
      required: true,
    }
  )
  .setVersion('7.0.0')
  .setDefault(['void'])
  .setReturns('number')
  .setDescription('Returns the Absolute value of the number')
  .setExample(`
    $abs[1] // returns 1
    $abs[-1] // returns 1
  `)
  .setCode((data, scope, thisArg) => {
    const numbers = data.inside;
    const currentScope = scope[scope.length - 1];
    if (
      data.splits.length === 0 &&
      !currentScope.name.startsWith('$try_') &&
      !currentScope.name.startsWith('$catch_')
    ) {
      throw new Error(`${data.name} requires at least 1 argument`);
    }
    if (!numbers) throw new Error(`${data.name} requires at least 1 argument`);
    const abs = numbers.includes(TranspilerCustoms.FS) ||
      numbers.includes(discord) ||
      numbers.includes(TranspilerCustoms.MFS)
        ? parseResult(numbers.trim())
        : Number(numbers);
   
    const resultString = thisArg.getResultString( () => Math.abs('$0') ,[abs]);  
    const res = escapeMathResult(`(${resultString})`);
    currentScope.update(res, data);
    return {
      code: res,
      scope,
    };
  });
export const $abs = abs.build();
