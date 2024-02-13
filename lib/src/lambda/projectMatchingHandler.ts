import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import {getMatchAPI} from '@lib/src/utils/utils'
import {getRequest, requestWithBody} from '@lib/src/utils/requests'
import {requestHttpMethod} from '@lib/src/utils/enums'
import { v4 as uuidv4 } from 'uuid'
import {getRecommendationInfo, returnRecommendations} from '@lib/src/functions/functions'

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  try{
    const userId = event.pathParameters?.userID
    console.info(`Matching started for user ${userId}`)
    if(!userId){
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 400,
        body: JSON.stringify({error: 'id is missing in the path parameters' + context})
      }
    } else {
      const existingRecord = await getRequest('record?userId=', getMatchAPI(), userId)
      const data = await existingRecord.json()
      const limitCheckStruct = data[0]

      if(limitCheckStruct){
        if(limitCheckStruct.matchNumber >= 3){
          return {
            headers: {'Content-Type': 'application/json'},
            statusCode: 200,
            body: 'Match limit exceeded. Try again later'
          }
        } else {
          console.log('Hit old record')
          const updatedMatchRecord = {
            matchNumber: limitCheckStruct.matchNumber + 1
          }
          await requestWithBody(`record/${limitCheckStruct.id}`, getMatchAPI(), updatedMatchRecord, requestHttpMethod.PATCH)
          const userRecs = await returnRecommendations(userId)
          const postInfo = await getRecommendationInfo(userRecs)

          return {
            headers: {'Content-Type': 'application/json'},
            statusCode: 200,
            body: JSON.stringify(postInfo)
          }

        }
      } else {
        console.log('Hit new record creation')
        const newMatchRecord = {
          id: uuidv4(),
          userId: userId,
          createdAt: Date.UTC(Date.now()),
          matchNumber: 1
        }
        await requestWithBody('record', getMatchAPI(), newMatchRecord, requestHttpMethod.POST)

        const userRecs = await returnRecommendations(userId)

        const postInfo = await getRecommendationInfo(userRecs)

        return {
          headers: {'Content-Type': 'application/json'},
          statusCode: 200,
          body: JSON.stringify(postInfo)
        }
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