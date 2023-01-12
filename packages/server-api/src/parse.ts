import { StNodeTree } from 'node'
import { assertParse } from 'parser'
import { readFileAsString } from 'utils'

import { getEnv } from './env'

// Get file name from environment variable and parse it
export const parseDefaultTreeFile = async () =>
	parse(getEnv('TREE_FILE'))

// Call assertParse function from typia
export const parse = async (
	fileName: string,
): Promise<StNodeTree> =>
	assertParse(await readFileAsString(fileName))
