import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEvent,
  APIGatewayProxyEventBase,
  Context
} from 'aws-lambda'
import {handler} from '@lib/src/lambda/projectMatchingHandler'

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

