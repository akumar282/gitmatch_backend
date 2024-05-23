import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEvent,
  APIGatewayProxyEventBase,
  Context
} from 'aws-lambda'
import {handler} from '@lib/src/lambda/projectMatchingHandler'
import {handler as like} from '@lib/src/lambda/temporaryLikePostHandler'

test('Project Matching Lambda Test', async () => {
  const mockEvent: Partial<APIGatewayProxyEvent> = {
    pathParameters: {
      userID: 'af721c38-5aa2-447d-b722-f9f92666c6b4'
    },
    body: 'test'
  }

  const mockContext: Partial<Context> = {
    logGroupName: 'mockLogGroupName'
  }

  const result = await handler(
    <APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>>mockEvent,
    <Context>mockContext
  )
  console.log(result)
  expect(result)
}, 15000)


test('Like Test', async () => {
  const mockEvent: Partial<APIGatewayProxyEvent> = {
    pathParameters: {
      postId: 'e8fbd460-b264-4122-a0f2-04e47cb623a1'
    },
    body: JSON.stringify({
      userId: '9ddf6cc3-7a05-4bae-a2a7-8b8689d9441a'
    })
  }

  const mockContext: Partial<Context> = {
    logGroupName: 'mockLogGroupName'
  }

  const result = await like(
    <APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>>mockEvent,
    <Context>mockContext
  )
  console.log(result)
  expect(result)
}, 15000)

