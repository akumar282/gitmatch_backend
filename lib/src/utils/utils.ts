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