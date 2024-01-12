import * as matchMake from '@lib/src/lambda/projectMatchingHandler'
import {APIGatewayProxyEvent, Context} from 'aws-lambda'
/* eslint-disable */

test('AppSync Request', async () => {
  const testEvent : APIGatewayProxyEvent = {
    body: '',
    headers: {},
    httpMethod: '',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: '',
    queryStringParameters: {},
    requestContext: {
      accountId: '',
      apiId: '',
      authorizer: undefined,
      protocol: '',
      httpMethod: '',
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '',
        user: null,
        userAgent: null,
        userArn: null
      },
      path: '',
      stage: '',
      requestId: '',
      requestTimeEpoch: 0,
      resourceId: '',
      resourcePath: ''
    },
    resource: '',
    stageVariables: null,
    pathParameters: {
      id: '123'
    }
  }

  const testContext: Context = {
    done(error?: Error, result?: any): void {
    }, fail(error: Error | string): void {
    }, succeed(messageOrObject: any, object?: any): void {
    },
    awsRequestId: '',
    callbackWaitsForEmptyEventLoop: false,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    logGroupName: '',
    logStreamName: '',
    memoryLimitInMB: '',
    getRemainingTimeInMillis(): number {
      return 0
    }
  }
  const result = await matchMake.handler(testEvent, testContext)
  // @ts-ignore
  console.log(JSON.parse(result.body))
  // @ts-ignore
  const info = JSON.parse(result.body)
  console.log(info[0].id)
  // console.log(record2)
  expect(result)
})