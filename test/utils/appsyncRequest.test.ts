import {matchDataRequest, signedAppSyncQuery} from '@lib/src/utils/appsyncRequest'
import { getUsersModel } from '@lib/src/graphql/queries'
import { requestHttpMethod } from '@lib/src/utils/enums'
import {getAccessKeyId, getMatchAPI, getSecretKey} from '@lib/src/utils/utils'
import {SignatureV4} from '@aws-sdk/signature-v4'
import {Sha256} from '@aws-crypto/sha256-js'

test('AppSync Request', async () => {
  const userId: string = 'af721c38-5aa2-447d-b722-f9f92666c6b4'
  const result = await signedAppSyncQuery(getUsersModel, requestHttpMethod.POST, {id: userId})
  console.log(result)
  expect(result.data.getUsersModel.id).toEqual(userId)
})

test('Gateway Request', async () => {

  const gatewaySigner = new SignatureV4({
    credentials: {
      accessKeyId: getAccessKeyId(),
      secretAccessKey: getSecretKey()
    },
    region: 'us-west-2',
    service: 'execute-api',
    sha256: Sha256
  })
  const data = {
    id: '256156434',
    userId: '34',
    createdAt:'345',
    matchNumber: 3
  }
  const request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'host' : new URL(getMatchAPI()).hostname,
    },
    protocol: 'https:',
    hostname: new URL(getMatchAPI()).hostname,
    path: '?userId=123'
  }

  const url = `https://${request.hostname}${request.path}`

  // Log the full URL
  console.log('Constructed URL:', url)
  // const signedRequest = await gatewaySigner.sign(request, {
  //   signingDate: new Date(),
  // })
  const response = await fetch('https://qy04ue51zf.execute-api.us-west-2.amazonaws.com/prod/record', request)
  console.log(await response.json())
  expect(response.body).toEqual('userId')
})