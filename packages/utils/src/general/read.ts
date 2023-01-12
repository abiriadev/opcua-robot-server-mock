import { readFile } from 'node:fs/promises'

// Read file as a single string.
// NOTE: this is not so efficient,
// but typia currently does not support streams
export const readFileAsString = async (
	fileName: string,
): Promise<string> => (await readFile(fileName)).toString()
