import log from '../src/index.js';
		
test('log', () => {
	const spy = jest.spyOn(console, 'log');
	log('hello');
	expect(spy).toHaveBeenCalledWith('hello');
});