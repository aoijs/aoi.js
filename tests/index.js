const {Transpiler,functions}  =  require("../dist/cjs/index.js");

const btotcode = `
$log[hi]
$onlyif[$ping<100;Pong!]
`;

const ttobcode = `
$onlyif[$ping<100;Pong!]
$log[hi]
`;

const t1 = Transpiler(ttobcode,{
    minify: true,
});

const t2 = Transpiler(btotcode,{
    reverse: true,
    minify: true,
});

console.log(t1.func.toString());
console.log("-------------------");
console.log(t2.func.toString());