const {Transpiler,functions}  =  require("../dist/cjs/index.js");
const beautify = require('js-beautify').js;
const codeToTranspile = `
$let[i;0]
$let[maths;0]
$while[ $get[i] < 10;
  $let[maths;$math[( $get[maths] + ( sin( $get[maths] )+1 ) )/2]]
  $log[sum@$get[i]: $get[maths]]
  $inc[$get[i];++]
] 
`;

const transpiledCode = Transpiler(codeToTranspile,{
  minify: true,
});

const beutifiedCode = beautify(transpiledCode.func.toString(), { indent_size: 2, space_in_empty_paren: true });
console.log("-------------------------------------");
console.log("Original code:\n", codeToTranspile);
console.log("\n\n\nTranspiled code:\n", beutifiedCode);
console.log("-------------------------------------");
console.log("Output:\n");
transpiledCode.func();
