import {SignatureV4} from '@aws-sdk/signature-v4'
import {Sha256} from '@aws-crypto/sha256-js'
import {DocumentNode} from 'graphql/language'
import {requestHttpMethod} from './enums'
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

export async function signedAppSyncQuery(query: string | DocumentNode, method: requestHttpMethod, variables?: object) {
  let body: string
  if(variables) {
    body = JSON.stringify({query, variables})
  } else {
    body = JSON.stringify({query})
  }

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

export async function requestWithBody(
  path: string,
  url: string,
  body: object,
  method: requestHttpMethod
) {
  const postRequest = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'host' : new URL(url).hostname,
    },
    protocol: 'https:',
    hostname: new URL(url).hostname,
    body: JSON.stringify(body),
    path: path
  }
  const requestURI = url.concat(postRequest.path)
  return await fetch(requestURI, postRequest)
}

export async function getRequest(path: string, url: string, id: string) {
  const constructedPath = path.concat(id)
  const getRequest = {
    method: requestHttpMethod.GET,
    headers: {
      'Content-Type': 'application/json',
      'host' : new URL(url).hostname,
    },
    protocol: 'https:',
    hostname: new URL(url).hostname,
    path: constructedPath
  }
  const requestURI = url.concat(getRequest.path)
  return await fetch(requestURI, getRequest)
}