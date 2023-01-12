// Check whether the given node id exists in current namespace.
import { Namespace, NodeId } from 'node-opcua'

// NOTE: if namespace does not match, it will return true.
export const nodeExists = (
	ns: Namespace,
	nid: string | NodeId,
): boolean =>
	NodeId.resolveNodeId(nid).namespace !== ns.index ||
	ns.findNode(nid) !== null
