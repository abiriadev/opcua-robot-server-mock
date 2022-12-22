import { Expose, Transform } from 'class-transformer'

export class Node {
	@Expose({
		name: 'NodeId',
	})
	readonly nodeId: string

	@Expose({
		name: 'NodeClass',
	})
	readonly nodeClass: string

	@Expose({
		name: 'BrowseName',
	})
	@Transform(({ value }) => (value === null ? 'null' : value.toString()), {
		toClassOnly: true,
	})
	readonly browseName: string

	@Expose({
		name: 'DisplayName',
	})
	readonly displayName: string

	constructor(
		nodeId: string,
		nodeClass: string,
		displayName: string,
		browseName: string,
	) {
		this.nodeId = nodeId
		this.nodeClass = nodeClass
		this.displayName = displayName
		this.browseName = browseName
	}
}
