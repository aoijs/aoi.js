import { type ProxyType } from '@aoi.js/typings/type.js';

export default function proxyBuilder<T>(variableName: string) {
	function createProxy<S>(state: string) {
		const handler: ProxyHandler<Record<string, unknown>> = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			get(_, propKey) {
				if (propKey === 'build') {
					return () => state;
				}
<<<<<<< HEAD
				
				// Dynamically handle method calls			
=======

				// Dynamically handle method calls
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
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
