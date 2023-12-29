import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import {requestHttpMethod} from '@lib/src/utils/enums'
import {getMatchAPI} from '@lib/src/utils/utils'

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const api = getMatchAPI()

  try{
    const userId = event.pathParameters?.id
    if(!userId){
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 400,
        body: JSON.stringify({error: 'id is missing in the path parameters'})
      }
    } else {
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

      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 200,
        body: JSON.stringify(await existingRecord.json())
      }
    }
  } catch (error) {
    const eventInfo = JSON.stringify({error, event, context})
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 400,
      body: eventInfo
    }
  }

}