import { assertGetEnvPrefixFactory } from 'utils'

// NOTE: this value will be used to know where to print result.
export const prefix = 'OPCUA_CLONER'

export const getEnv = assertGetEnvPrefixFactory(prefix)
