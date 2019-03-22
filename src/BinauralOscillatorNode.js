import GroupNode from './GroupNode';

export default function BinauralOscillatorNode(ctx, { frequency, spread }) {
	const oscLeft = new OscillatorNode(ctx, {
		type: 'sine',
		frequency: frequency - (spread / 2)
	});
	const oscRight = new OscillatorNode(ctx, {
		type: 'sine',
		frequency: frequency + (spread / 2)
	});
	const merger = new ChannelMergerNode(ctx);

	oscLeft.connect(merger, 0, 0);
	oscRight.connect(merger, 0, 1);

	oscLeft.start();
	oscRight.start();

	return new GroupNode(null, merger);
}
