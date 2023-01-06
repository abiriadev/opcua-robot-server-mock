// NOTE: as of now, we can't simply stringify the NodeId class directly,
// since it uses Buffer type under the hood, which is not parsed correctly in typia.
export type NodeId = string
