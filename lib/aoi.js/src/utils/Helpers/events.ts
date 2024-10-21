import { type ITranspilerData } from '../../typings/interface.js';
import { type Optional } from '../../typings/type.js';

export function createData(data: Optional<ITranspilerData, 'channel' | 'guild' | 'message' | 'command'>): Optional<ITranspilerData, 'command'> {
	const obj: Optional<ITranspilerData, 'command'> = {
		bot: data.bot,
		client: data.client,
	};

	if (data.channel) obj.channel = data.channel;
	if (data.guild) obj.guild = data.guild;
	if (data.message) obj.message = data.message;
	if (data.args) obj.args = data.args;
	if (data.data) obj.data = data.data;

	return obj;
}
