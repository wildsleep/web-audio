import GroupNode from './GroupNode';

export default function DelayFeedbackNode(ctx, { maxDelayTime, delayTime, feedback }) {
	const input = new GainNode(ctx);
	const delay = new DelayNode(ctx, { maxDelayTime, delayTime });
	const feedbackNode = new GainNode(ctx, { gain: feedback });

	input.connect(delay);
	delay.connect(feedbackNode);
	feedbackNode.connect(input);

	return new GroupNode(input, input, {
		delayTime: delay.delayTime,
		feedback: feedbackNode.gain
	});
}
