import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import {matchDataRequest} from '@lib/src/utils/appsyncRequest'
import {requestHttpMethod} from '@lib/src/utils/enums'

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  try{
    const userId = event.pathParameters?.id
    if(!userId){
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 400,
        body: JSON.stringify({error: 'id is missing in the path parameters'})
      }
    } else {

      const getMatchNumber = await matchDataRequest(requestHttpMethod.GET, {queryStringParameters: {'userId': '123'}})
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 200,
        body: JSON.stringify(getMatchNumber)
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