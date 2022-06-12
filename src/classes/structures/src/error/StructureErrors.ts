export default class StructureError {
	/**
	 * GroupError
	 */
	public static GroupError(
		ErrorName: string,
		MethodName: string,
		ErrorMessage: string,
	): void {
		throw new Error(
			`[Group : ${ErrorName}] -> ${MethodName} : ${ErrorMessage}`,
		);
	}
	public static LimitGroupError(
		ErrorName: string,
		MethodName: string,
		ErrorMessage: string,
	): void {
		throw new Error(
			`[LimitGroup : ${ErrorName}] -> ${MethodName} : ${ErrorMessage}`,
		);
	}
	public static BinaryError(
		ErrorName: string,
		MethodName: string,
		ErrorMessage: string,
	): void {
		throw new Error(
			`[Binary : ${ErrorName}] -> ${MethodName} : ${ErrorMessage}`,
		);
	}
}
