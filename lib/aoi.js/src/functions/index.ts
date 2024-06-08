import { type FunctionData } from '../typings/interfaces.js';
import * as JSFuncs from './js/index.js';
import * as DiscordFuncs from './discord/index.js';

export { JSFuncs, DiscordFuncs };

const functions: Record<string, FunctionData> = {
	...JSFuncs,
	...DiscordFuncs,
};

export default functions;
