import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'
import { DocumentNode } from 'graphql/language'
import { requestHttpMethod } from './enums'
import {getAccessKeyId, getAppSyncUrl, getSecretKey} from './utils'

const appsyncSigner = new SignatureV4({
  credentials: {
    accessKeyId: getAccessKeyId(),
    secretAccessKey: getSecretKey()
  },
  region: 'us-west-2',
  service: 'appsync',
  sha256: Sha256
})

export async function signedAppSyncQuery(query: string | DocumentNode, method: requestHttpMethod, variables: object) {
  const body = JSON.stringify({query, variables})
  const request = {
    method: method,
    headers: {
      'Content-Type': 'application/graphql',
      'host' : new URL(getAppSyncUrl()).hostname,
    },
    protocol: 'https:',
    hostname: new URL(getAppSyncUrl()).hostname,
    path: '/graphql',
    body: body,
    region: 'us-west-2',
    service: 'appsync'
  }

  const signedRequest = await appsyncSigner.sign(request, {
    signingDate: new Date(),
  })

  const response = await fetch(getAppSyncUrl(), {
    method: signedRequest.method,
    headers: signedRequest.headers,
    body: signedRequest.body
  })

  return response.json()

}