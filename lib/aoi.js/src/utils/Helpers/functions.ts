export function _abbreviate(number: number, decimal: number) {
	const SI_SYMBOLS = [
		'',
		'K',
		'M',
		'B',
		'T',
		'Qa',
		'Qi',
		'Sx',
		'Sp',
		'Oc',
		'No',
		'Dc',
		'Udc',
		'Ddc',
		'Tdc',
		'Qadc',
		'Qidc',
		'Sxdc',
		'Spdc',
		'Ocdc',
		'Nmdc',
		'Vg',
		'Uvg',
		'Dvg',
		'Tvg',
		'Qavg',
		'Qvg',
		'Sxvg',
		'Spvg',
		'Ovg',
		'Nvg',
		'Tg',
	] as const;

	const tier = Math.floor(Math.log10(Math.abs(number || 1)) / 3);
	if (tier === 0) return number;
	const suffix = SI_SYMBOLS[tier];
	const scale = Math.pow(10, tier * 3);
	const scaled = number / scale;
	return scaled.toFixed(decimal) + suffix;
};
