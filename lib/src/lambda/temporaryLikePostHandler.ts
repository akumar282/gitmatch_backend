import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import {signedAppSyncQuery} from '@lib/src/utils/requests'
import {getPostsModel, updatePostsModel} from '@lib/src/graphql/queries'
import {requestHttpMethod} from '@lib/src/utils/enums'

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
    'Content-Type': 'application/json',
  }

  try {
    const postId = event.pathParameters?.postId
    if (!postId) {
      return {
        headers: CORS_HEADERS,
        statusCode: 400,
        body: JSON.stringify({error: 'UserId is missing in the query parameters'})
      }
    } else {
      if (event.body != null) {
        const eventbody = JSON.parse(event.body)
        const userId = eventbody.userId
        const postResult = await signedAppSyncQuery(getPostsModel, requestHttpMethod.POST, {id: postId})
        if(postResult.data.getPostsModel.likes_users.includes(userId)) {
          const replacement = postResult.data.getPostsModel.likes_users.filter((x: string) => x !== userId) as []
          const likesNumberNew = postResult.data.getPostsModel.likes - 1
          const input = {
            id: postId,
            likes: likesNumberNew,
            likes_users: replacement
          }
          await signedAppSyncQuery(updatePostsModel, requestHttpMethod.POST, {input: input})
          return {
            headers: CORS_HEADERS,
            statusCode: 200,
            body: JSON.stringify('Success')
          }
        } else {
          const replacement = [...postResult.data.getPostsModel.likes_users, userId]
          const likesNumberNew = postResult.data.getPostsModel.likes + 1
          const input = {
            id: postId,
            likes: likesNumberNew,
            likes_users: replacement
          }
          await signedAppSyncQuery(updatePostsModel, requestHttpMethod.POST, {input: input})
          return {
            headers: CORS_HEADERS,
            statusCode: 200,
            body: JSON.stringify('Success')
          }
        }
      } else {
        return {
          headers: CORS_HEADERS,
          statusCode: 400,
          body: JSON.stringify({error: 'Request body is empty'})
        }
      }
    }
  } catch (e) {
    console.log(e)
    console.log(event)
    console.log(context)
    return {
      headers: CORS_HEADERS,
      statusCode: 400,
      body: JSON.stringify({ error: 'Request Failed. Check logs for information' })
    }
  }
}