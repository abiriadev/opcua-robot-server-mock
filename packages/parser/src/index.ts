import { createAssertParse } from 'typia'
import { Node } from 'node'

export const parse = createAssertParse<Array<Node>>()
