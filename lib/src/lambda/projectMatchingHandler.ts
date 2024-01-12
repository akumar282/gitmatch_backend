import {APIGatewayProxyEvent, Context} from 'aws-lambda'
import {getMatchAPI} from '@lib/src/utils/utils'
import {getRequest, requestWithBody, signedAppSyncQuery} from '@lib/src/utils/appsyncRequest'
import {requestHttpMethod} from '@lib/src/utils/enums'
import { v4 as uuidv4 } from 'uuid'
import {getUsersModel} from '@lib/src/graphql/queries'
import {userItem} from '@lib/src/utils/types'

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<unknown> {

  try{
    const userId = event.pathParameters?.id
    if(!userId){
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 400,
        body: JSON.stringify({error: 'id is missing in the path parameters'})
      }
    } else {
      const existingRecord = await getRequest('record?userId=', getMatchAPI(), userId)
      const data = await existingRecord.json()
      const recordQueryResult = JSON.parse(data.body)
      const limitCheckStruct = recordQueryResult[0]

      if(recordQueryResult[0]){
        if(limitCheckStruct.matchNumber <= 3){
          return {
            headers: {'Content-Type': 'application/json'},
            statusCode: 200,
            body: 'Match limit exceeded. Try again later'
          }
        } else {
          const updatedMatchRecord = {
            id: limitCheckStruct.id,
            matchNumber: limitCheckStruct.matchNumber + 1
          }
          await requestWithBody('record', getMatchAPI(), updatedMatchRecord, requestHttpMethod.PATCH)
          const user = await signedAppSyncQuery(getUsersModel, requestHttpMethod.POST, {id: userId})

          const preferenceData: userItem = {
            cloudProviderString: user.data.getUsersModel.cloud_provider_tag.toString(),
            devTypeString: user.data.getUsersModel.dev_type_tag.toString(),
            difficultyString: user.data.getUsersModel.difficulty_tag.toString(),
            frameworkString: user.data.getUsersModel.framework_tag.toString(),
            interestsString: user.data.getUsersModel.interest_tag.toString(),
            sizeString: user.data.getUsersModel.size_tag.toString(),
            languageString: user.data.getUsersModel.lang_tag.toString()
          }

        }
      } else {
        const newMatchRecord = {
          id: uuidv4(),
          userId: userId,
          createdAt: Date.UTC(Date.now()),
          matchNumber: 1
        }
        await requestWithBody('record', getMatchAPI(), newMatchRecord, requestHttpMethod.POST)
      }
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