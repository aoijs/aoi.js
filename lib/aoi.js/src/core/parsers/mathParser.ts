const regex =
    /#MATH_FUNCTION_START#[#$._0-9a-\s*+-/%^&|?()]*#MATH_FUNCTION_END#/gi;
export default function fixMath(code: string) {
	let res = code;
	const matches = code.match(regex);
	matches;
	if (!matches) return code;
	matches.forEach((match) => {
		res = res.replace(
			match,
			'${' +
                match
                	.replaceAll('#MATH_FUNCTION_END#', '')
                	.replaceAll('#MATH_FUNCTION_START#', '') +
                '}',
		);
	});
	return res;
}

// console.log( fixMath( "log(`#MATH_FUNCTION_START#(1+2*#MATH_FUNCTION_START#(1-3)#MATH_FUNCTION_END#)#MATH_FUNCTION_END# lol ok #MATH_FUNCTION_START#(2+#MATH_FUNCTION_START#(3/2)#MATH_FUNCTION_END#)#MATH_FUNCTION_END#`)" ) );
