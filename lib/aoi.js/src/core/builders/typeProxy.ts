import { type ProxyType } from '@aoi.js/typings/type.js';

export default function proxyBuilder<T>(variableName: string) {
	function createProxy<S>(state: string) {
		const handler: ProxyHandler<Record<string, unknown>> = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			get(_, propKey) {
				if (propKey === 'build') {
					return () => state;
				}

				// Dynamically handle method calls
				return function (...args: any[]) {
					const argsStr = args
						.map((arg) => JSON.stringify(arg))
						.join(', ');
					const newState = `${state}.${String(propKey)}(${argsStr})`;
					return createProxy(newState);
				};
			},
		};

		return new Proxy({}, handler) as ProxyType<S>;
	}

	return createProxy<T>(variableName);
}
