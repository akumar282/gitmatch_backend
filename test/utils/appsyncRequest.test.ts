import {signedAppSyncQuery} from '@lib/src/utils/appsyncRequest'
import {getUsersModel} from '@lib/src/graphql/queries'
import {requestHttpMethod} from '@lib/src/utils/enums'
import {getMatchAPI} from '@lib/src/utils/utils'

test('AppSync Request', async () => {
  const userId: string = 'af721c38-5aa2-447d-b722-f9f92666c6b4'
  const result = await signedAppSyncQuery(getUsersModel, requestHttpMethod.POST, {id: userId})
  console.log(result)
  expect(result.data.getUsersModel.id).toEqual(userId)
})

test('Get Request', async () => {
  const api = getMatchAPI()
  const userId = '123'
  const getRequest = {
    method: requestHttpMethod.GET,
    headers: {
      'Content-Type': 'application/json',
      'host' : new URL(getMatchAPI()).hostname,
    },
    protocol: 'https:',
    hostname: new URL(getMatchAPI()).hostname,
    path: `record?userId=${userId}`
  }
  const url = api.concat(getRequest.path)
  const existingRecord = await fetch(url, getRequest)
  console.log(JSON.stringify(await existingRecord.json()))

})