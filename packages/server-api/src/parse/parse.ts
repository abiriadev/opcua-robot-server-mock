import { readFile } from 'node:fs/promises'

import { type UaNode } from 'node'
import { assertParse } from 'parser'

// Call assertParse function from typia
export const parse = async (
	fileName: string,
): Promise<Array<UaNode>> =>
	assertParse(await readFileAsString(fileName))

// Read file as a single string.
// NOTE: this is not so efficient,
// but typia currently does not support streams
const readFileAsString = async (
	fileName: string,
): Promise<string> => (await readFile(fileName)).toString()
