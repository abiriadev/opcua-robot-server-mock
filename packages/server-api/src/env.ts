import { config } from 'dotenv'
import { assertGetEnvPrefixFactory } from 'utils'

// Initialize dotenv as loading this module
// this will be performed only once
config()

// NOTE: below code is specific to this project
export const getEnv =
	assertGetEnvPrefixFactory('OPCUA_SERVER')
