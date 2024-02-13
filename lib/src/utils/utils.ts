export function getAppSyncKey(): string {
  if(process.env.APPSYNC_KEY) {
    return process.env.APPSYNC_KEY
  } else {
    throw new Error('Error: AppSyncKey not defined')
  }
}

export function getAppSyncUrl(): string {
  if(process.env.APPSYNC_URL) {
    return process.env.APPSYNC_URL
  } else {
    throw new Error('Error: AppSyncUrl not defined')
  }
}

export function getAccessKeyId(): string {
  if(process.env.ACCESS_KEY_ID) {
    return process.env.ACCESS_KEY_ID
  } else {
    throw new Error('Error: AccessKeyId not defined')
  }
}

export function getSecretKey(): string {
  if(process.env.SECRET_ACCESS_KEY) {
    return process.env.SECRET_ACCESS_KEY
  } else {
    throw new Error('Error: SecretKey not defined')
  }
}

export function getMatchAPI(): string {
  if(process.env.MATCH_NUMBER_API) {
    return process.env.MATCH_NUMBER_API
  } else {
    throw new Error('Error: Match API endpoint not defined')
  }
}

export function getOrgID(): string {
  if(process.env.OPEN_AI_ORG_ID) {
    return process.env.OPEN_AI_ORG_ID
  } else {
    throw new Error('Error: OPEN_AI_ORG_ID not defined')
  }
}

export function getOpenAIKey(): string {
  if(process.env.OPEN_AI_KEY) {
    return process.env.OPEN_AI_KEY
  } else {
    throw new Error('Error: OPEN_AI_ORG_ID not defined')
  }
}