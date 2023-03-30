const { Transpiler, functions } = require( '../dist/cjs' );

const code = `$let[hi;1]
$comment[ $log[lol] <- this wont execute ]
$log[hi -> $get[hi]]`;

const transpiler = Transpiler( code, {
    minify: true, // true to shorten the code (recommended)
} );

const func = transpiler.func;
console.log( func.toString() );
func();