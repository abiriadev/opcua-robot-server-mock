import { getEnv } from './env'
import { parse } from './parse'

// Get file name from environment variable and parse it
export const parseDefaultTreeFile = async () =>
	parse(getEnv('TREE_FILE'))
