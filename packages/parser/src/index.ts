import {
	createAssertParse,
	createAssertStringify,
	createIsParse,
	createIsStringify,
	createStringify,
} from 'typia'
import { Node } from 'node'

type T = Array<Node>

export const assertParse = createAssertParse<T>()

export const isParse = createIsParse<T>()

export const stringify = createStringify<T>()

export const isStringify = createIsStringify<T>()

export const assertStringify = createAssertStringify<T>()
