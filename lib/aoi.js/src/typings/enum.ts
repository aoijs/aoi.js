export enum FunctionType {
	Setter,
	Getter,
	Function,
	FunctionGetter,
	Scope,
	ScopeGetter,
}

export enum ReturnType {
	Void,
	Any,
	Number,
	String,
	Boolean,
	Object,
	Array,
}

export enum TranspilerCustoms {
	F = '#FUNCTION#',
	FS = '#FUNCTION_START#',
	FE = '#FUNCTION_END#',
	FSEP = '#FUNCTION_SEPARATOR#',
	FFUN = '#FUNCTION_FUNCTION#',
	FSET = '#FUNCTION_SETTER#',
	FGET = '#FUNCTION_GETTER',
	FISS = '#FUNCTION_INSIDE_SCOPE_START#',
	FISE = '#FUNCTION_INSIDE_SCOPE_END#',
	FSS = '#FUNCTION_SCOPE_START#',
	FSE = '#FUNCTION_SCOPE_END#',
	FFS = '#FUNCTION_FUNCTION_START#',
	FFE = '#FUNCTION_FUNCTION_END#',
	MFS = '#MATH_FUNCTION_START#',
	MFE = '#MATH_FUNCTION_END#',
	SL = '#STRING_LITERAL#',
	NL = '#NEW_LINE#',
	OSEP = '#OBJECT_SEPARATOR#',
	OS = '#OBJECT_STARTER#',
	OE = '#OBJECT_ENDER#',
	AS = '#ARRAY_STARTER#',
	AE = '#ARRAY_ENDER#',
	ASEP = '#ARRAY_SEPARATOR#',
}

export enum BundlerCustoms  {
	LB = '#LEFT_BRACKET#',
	RB = '#RIGHT_BRACKET#',
	EJS = '#EMBEDDED_JS#',
}

export enum AoiClientEvents {
	Error = 'error',
}