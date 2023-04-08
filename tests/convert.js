// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Transpiler, functions } = require( "../dist/cjs" );
console.log( Object.keys( functions ) );

// bottom to top
const code = `
$log[hi -> $get[hi]]
$let[hi;1]
$comment[ $log[lol] <- this wont execute ]
`;
// top to bottom
const code2 = `
$let[hi;$root[$root[
    $multi[27
        ;$divide[9;
            $sum[1;2]
        ]
    ];4];1]]

$let[ok;$math[sin($get[hi]*PI/2)]]
$log[hi -> $get[hi]]
$log[ok -> $get[ok]]
`;

// better way to do if/elseif/else
const code3 = `
$if[$ping>200;
$log[slow]
]
$elseif[$ping>100;
$log[mid]
]
$else[
$log[fast]
]
`;

const transpiler = Transpiler( code, {
    minify: true,
    reverse:true // true to shorten the code (recommended)
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

func3( { client: { ws: { data: { ping: 120 } } } });
console.log( "--------------------" );

const code4 = "$loop[10;{};$log[$env[loop_index]]]";

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

const code5 = ` $onlyif[$authorId===715755977483223081n || $authorId === 285118390031351809n;$log[no]]
$log[yes]`;

const transpiler5 = Transpiler( code5, {
    minify: true, // true to shorten the code (recommended)
} );

const func5 = transpiler5.func;

console.log(`--------------------
code:
${code5}

func:
${func5.toString()}

`);

func5( { author: { id: 285118390031351809n } } );

console.log( "--------------------" );

const code6 = `

$switch[$ping>200;
    $case[true; $log[slow]]
    $case[false; $log[fast]]
]
`;

const transpiler6 = Transpiler( code6, {
    minify: true, // true to shorten the code (recommended)
} );

const func6 = transpiler6.func;

console.log(`--------------------
code:
${code6}

func:
${func6.toString()}
`);

func6( { client: { ws: { data: { ping: 120 } } } } );

console.log( "--------------------" );