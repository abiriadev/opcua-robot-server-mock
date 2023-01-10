import { type UaNode } from 'node'
import {
	createAssertParse,
	createAssertStringify,
	createIsParse,
	createIsStringify,
	createStringify,
} from 'typia'

type T = Array<UaNode>

export const assertParse = createAssertParse<T>()

export const isParse = createIsParse<T>()

export const stringify = createStringify<T>()

export const isStringify = createIsStringify<T>()

export const assertStringify = createAssertStringify<T>()
