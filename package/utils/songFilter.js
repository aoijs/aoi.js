module.exports = {
	bass: "Set the bass for the audio;Value between -20 to 20;bass;g={value};dynaudnorm;f=150:g=15;{value}>-21&&{value}<21&&{value}!=0",
	echo: "Set an echo for the audio;Value between 0.1 to 90000;aecho;1.0:0.75:{value}:0.5;{value}>0&&{value}<=90000",
	pitch: "Set the pitch for the audio;Value between 0.1 to 1.9;asetrate;48000*{value};aresample;48000;{value}>0&&{value}!=1&&{value}<2",
	speed: "Set speed for the audio;Value between 0.5 to 9.9;atempo;{value};{value}>0.4&&{value}!=1&&{value}<10",
	vibrato: "Set vibrato for the audio;Value between 0.1 to 0.9;vibrato;d={value};{value}>0&&{value}<1",
	pulsator: "Set an pulsator for the audio;Value between 0.1 to 99.9;apulsator;hz={value};{value}>0&&{value}<100",
	contrast: "Set contrast for the audio;Value between 0.1 to 99.9;acontrast;{value};{value}>0&&{value}<100",
	gate: "Reduce noice of the audio;Value '1' to enable and '0' to disable;agate;;[0,1].includes({value})&&{value}==1",
	flanger: "Apply a flanging effect for the audio;Value '1' to enable and '0' to disable;flanger;;[0,1].includes({value})&&{value}==1",
	phaser: "Add a phasing effect for the audio;Value '1' to enable and '0' to disable;aphaser;;[0,1].includes({value})&&{value}==1",
	surround: "Apply surround filter for the audio;Value '1' to enable and '0' to disable;surround;;[0,1].includes({value})&&{value}==1",
	earwax: "Make audio easier to listen on headphones;Value '1' to enable and '0' to disable;earwax;;[0,1].includes({value})&&{value}==1"
}