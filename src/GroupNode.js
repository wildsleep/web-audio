export default function GroupNode(input, output, params) {
	const context = (input || output).context;
	const node = new GainNode(context);

	if (input) {
		node.connect(input);
	}

	if (output) {
		node.connect = output.connect.bind(output);
		node.disconnect = output.disconnect.bind(output);
	}

	Object.assign(node, params);

	return node;
}
