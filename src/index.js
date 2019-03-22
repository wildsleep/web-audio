import BinauralOscillatorNode from './BinauralOscillatorNode';
import ResonatorSwirlNode from './ResonatorSwirlNode';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();
// TODO: Make sure audio context is not suspended on start.
// This could be done by only creating the audio context in response to a user action.

const mediaElements = [...document.querySelectorAll('audio')];
const button = document.querySelector('#btn');
let playing = false;

const sourceNodes = mediaElements.map(mediaElement => new MediaElementAudioSourceNode(ctx, { mediaElement }));

const inputFilter = new BiquadFilterNode(ctx);
inputFilter.type = 'lowpass';
inputFilter.frequency.value = 3000;

const inputGain = new GainNode(ctx);
inputGain.gain.value = 1;

const inputCompressor = new DynamicsCompressorNode(ctx, {
	threshold: -50,
	knee: 40,
	ratio: 3,
	attack: 0,
	release: 0.25
});

const resonatorSwirl = new ResonatorSwirlNode(ctx, {
	resonators: [
		[midiToFrequency(54), 0.95], // F#3
		[midiToFrequency(54+3), 0.85], // A3
		[midiToFrequency(54+6), 0.75], // C4
		[midiToFrequency(54+8), 0.95], // D4
		[midiToFrequency(54+12), 0.6], // F#4
	]
});

const swirlGain = new GainNode(ctx, { gain: 0.1 });

const binaural = new BinauralOscillatorNode(ctx, {
	frequency: midiToFrequency(30),
	spread: 3
});

const binauralGain = new GainNode(ctx, { gain: 0.01 });

const outputLimiter = new DynamicsCompressorNode(ctx, {
	threshold: -6,
	knee: 3,
	ratio: 12,
	attack: 0,
	release: 0.25
});

connectAll([
	sourceNodes,
	inputFilter,
	inputGain,
	inputCompressor,
	resonatorSwirl,
	swirlGain
]);
binaural.connect(binauralGain);
connectAll([
	[swirlGain, binauralGain],
	outputLimiter,
	ctx.destination
]);

btn.addEventListener('click', () => {
	if (ctx.state !== 'running') {
		ctx.resume();
	}

	if (playing) {
		playing = false;
		binauralGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
		sourceNodes[3].mediaElement.pause();
		btn.innerHTML = 'Start';
	} else {
		playing = true;
		binauralGain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 2.0);
		sourceNodes[3].mediaElement.play();
		btn.innerHTML = 'Stop';
	}
});

function midiToFrequency(pitch) {
	return 2**((pitch - 69) / 12) * 440;
}

function connectAll(sequence) {
	for (let n = 1; n < sequence.length; ++n) {
		const inputs = Array.isArray(sequence[n-1]) ?
			sequence[n-1] : [sequence[n-1]];
		const outputs = Array.isArray(sequence[n]) ?
			sequence[n] : [sequence[n]];
		inputs.forEach(input => {
			outputs.forEach(output => {
				input.connect(output);
			});
		});
	}
}
