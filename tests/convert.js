const { Transpiler, functions } = require( '../dist/cjs' );
console.log( Object.keys( functions ) );
const code = `$let[hi;1]
$comment[ $log[lol] <- this wont execute ]
$log[hi -> $get[hi]]`;

const code2 = `$let[hi;$root[$root[
    $multi[27
        ;$divide[9;
            $sum[1;2]
        ]
    ];4];1]]

$let[ok;$math[sin($get[hi]*PI/2)]]
$log[hi -> $get[hi]]
$log[ok -> $get[ok]]`;

const transpiler = Transpiler( code, {
    minify: true, // true to shorten the code (recommended)
} );

const func = transpiler.func;

console.log( `--------------------
code:
${code }


func:
${func.toString() }

` );

func();
console.log( "--------------------" );
const transpiler2 = Transpiler( code2, {
    minify: true, // true to shorten the code (recommended)
} );

const func2 = transpiler2.func;
console.log(`--------------------
code:
${code2}


func:
${func2.toString()}

`);
func2();
console.log( "--------------------" );

const code3 = `
$let[hi;0]
$while[$get[hi] < 10;
    $log[$get[hi]]
    $inc[$get[hi]]
]
`;


const transpiler3 = Transpiler(code3, {
    minify: true, // true to shorten the code (recommended)
});

const func3 = transpiler3.func;

console.log(`--------------------
code:
${code3}


func:
${func3.toString()}

`);

func3();
console.log( "--------------------" );

const code4 = `$loop[10;{};$log[hi]]`;

const transpiler4 = Transpiler( code4, {
    minify: true, // true to shorten the code (recommended)
} );

const func4 = transpiler4.func;

console.log( `--------------------
code:
${code4 }

func:
${func4.toString() }

` );

func4();
console.log( "--------------------" );
