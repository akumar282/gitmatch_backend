import { signedAppSyncQuery } from '@lib/src/utils/appsyncRequest'
import { getUsersModel } from '@lib/src/graphql/queries'
import { requestHttpMethod } from '@lib/src/utils/enums'

test('AppSync Request', async () => {
  const userId: string = 'af721c38-5aa2-447d-b722-f9f92666c6b4'
  const result = await signedAppSyncQuery(getUsersModel, requestHttpMethod.POST, {id: userId})
  console.log(result)
  expect(result.data.getUsersModel.id).toEqual(userId)
})