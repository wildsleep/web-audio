import GroupNode from './GroupNode';
import DelayFeedbackNode from './DelayFeedbackNode';

export default function ResonatorSwirlNode(ctx, { resonators }) {
	const input = new GainNode(ctx);

	const combs = resonators.map(([frequency, feedback]) => {
		const resonator = new DelayFeedbackNode(ctx, {
			maxDelayTime: 0.1,
			delayTime: 1/frequency,
			feedback
		});
		return resonator;
	});

	const delay = new DelayFeedbackNode(ctx, {
		maxDelayTime: 10,
		delayTime: 0.75,
		feedback: 0.5
	});

	combs.forEach(effect => {
		input.connect(effect);
		effect.connect(delay);
	});

	return new GroupNode(input, delay);
}
