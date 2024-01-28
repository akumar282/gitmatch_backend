import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  switch (event.resource) {
    case '/record': {
      switch (event.httpMethod) {
        case 'GET' : {
          const userId = event.queryStringParameters?.userId
          if (!userId) {
            return {
              headers: { 'Content-Type': 'application/json' },
              statusCode: 400,
              body: JSON.stringify({ error: 'UserId is missing in the query parameters' })
            }
          } else {
            const command = new QueryCommand({
              TableName: 'matchNumberTable',
              IndexName: 'userIdIndex', // Specify the GSI name
              KeyConditionExpression: 'userId = :userId',
              ExpressionAttributeValues: {
                ':userId': userId
              }
            })
            const result = await docClient.send(command)
            if(result) {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 200,
                body: JSON.stringify(result.Items)
              }
            } else {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: event.path + ' ' + event.queryStringParameters
              }
            }
          }
        }
        case 'POST': {
          if (!event.body) {
            return {
              headers: {'Content-Type': 'application/json'},
              statusCode: 400,
              body: JSON.stringify({error: 'No data was received to post'})
            }
          } else {
            const data = JSON.parse(event.body)
            const command = new PutCommand({
              TableName: 'matchNumberTable',
              Item: {
                id: data.id,
                userId: data.userId,
                createdAt: data.createdAt,
                matchNumber: data.matchNumber
              }
            })
            const result = await docClient.send(command)
            if (result) {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 200,
                body: 'Item placed' + JSON.stringify(result)
              }
            } else {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: JSON.stringify({error: 'Error placing item '} + event.body)
              }
            }
          }
        }
        default: {
          return {
            headers: {
              'Content-Type': 'application/json'
            },
            statusCode: 405,
            body: 'Operation Not Supported ' + event + ' ' + context
          }
        }
      }
    }
    case '/record/{id}': {
      switch (event.httpMethod) {
        case 'GET' : {
          const id = event.pathParameters?.id
          if (!id) {
            return {
              headers: {'Content-Type': 'application/json'},
              statusCode: 400,
              body: JSON.stringify({error: 'id is missing in the path parameters'})
            }
          } else {
            const command = new GetCommand({
              TableName: 'matchNumberTable',
              Key: {
                id: id
              }
            })
            const result = await docClient.send(command)
            if (result) {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 200,
                body: JSON.stringify(result.Item)
              }
            } else {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: JSON.stringify({error: 'No item found with the provided id'})
              }
            }
          }
        }
        case 'PATCH': {
          const id = event.pathParameters?.id
          if (!id) {
            return {
              headers: {'Content-Type': 'application/json'},
              statusCode: 400,
              body: JSON.stringify({error: 'id is missing in the path parameters'})
            }
          }
          if (!event.body) {
            return {
              headers: {'Content-Type': 'application/json'},
              statusCode: 400,
              body: JSON.stringify({error: 'No data was received to patch'})
            }
          } else {
            const data = JSON.parse(event.body)
            const command = new UpdateCommand({
              TableName: 'matchNumberTable',
              Key: {
                id: id
              },
              UpdateExpression: 'set matchNumber = :matchNumber',
              ExpressionAttributeValues: {
                ':matchNumber': data.matchNumber
              },
              ReturnValues: 'ALL_NEW'
            })
            const result = await docClient.send(command)
            if (result) {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 200,
                body: 'Item updated' + JSON.stringify(result)
              }
            } else {
              return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: JSON.stringify({error: 'Error updating item '} + event.body)
              }
            }
          }
        }
        default: {
          return {
            headers: {
              'Content-Type': 'application/json'
            },
            statusCode: 405,
            body: 'Operation Not Supported ' + event + ' ' + context
          }
        }
      }
    }
    default: {
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 405,
        body: 'Operation Not Supported ' + event + ' ' + context
      }
    }
  }
}