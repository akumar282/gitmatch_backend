export function getAppSyncKey(): string {
  if(process.env.AppSyncKey) {
    return process.env.AppSyncKey
  } else {
    throw new Error('Error: AppSyncKey not defined')
  }
}

export function getAppSyncUrl(): string {
  if(process.env.AppSyncUrl) {
    return process.env.AppSyncUrl
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
  if(process.env.SECRET_KEY) {
    return process.env.SECRET_KEY
  } else {
    throw new Error('Error: SecretKey not defined')
  }
}