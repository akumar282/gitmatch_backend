import {getRequest, requestWithBody, signedAppSyncQuery} from '@lib/src/utils/requests'
import {getUsersModel, listPostsModels} from '@lib/src/graphql/queries'
import {requestHttpMethod} from '@lib/src/utils/enums'
import {getMatchAPI} from '@lib/src/utils/utils'

test('AppSync GetUser Request', async () => {
  const userId: string = 'af721c38-5aa2-447d-b722-f9f92666c6b4'
  const result = await signedAppSyncQuery(getUsersModel, requestHttpMethod.POST, {id: userId})
  console.log(JSON.stringify(result))
  expect(result.data.getUsersModel.id).toEqual(userId)
})

test('AppSync GetPosts', async () => {
  const result = await signedAppSyncQuery(listPostsModels, requestHttpMethod.POST, {limit: 40})
  console.log(JSON.stringify(result))
  expect(result.data.listPostsModels.items[0].id).toEqual('cab5b12a-9187-4924-af23-4491569a18fb')
})

test('Get match record Request', async () => {
  const existingRecord = await getRequest('record?userId=', getMatchAPI(), '34')
  console.log(JSON.stringify(await existingRecord.json()))
})

test('Post to matchNumber api', async () => {
  const api = getMatchAPI()
  const body = {
    id: '2343534534768',
    userId: '34453453453453',
    createdAt:'345345345345345',
    matchNumber: 2
  }
  const result = await requestWithBody('record', api, body, requestHttpMethod.POST)
  console.log(result)
  expect(result).toContain(result)
})

test('Update match record', async () => {
  const api = getMatchAPI()
  const body = {
    matchNumber: 2
  }
  const result = await requestWithBody('record/ddbcae8a-64eb-4fc0-92f6-cf1a14ff3650', api, body, requestHttpMethod.PATCH)
  console.log(await result.json())
  expect(result).toContain(result)
})