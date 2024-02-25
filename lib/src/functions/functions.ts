import {signedAppSyncQuery} from '@lib/src/utils/requests'
import {getPostsModel, getUsersModel, listPostsModels} from '@lib/src/graphql/queries'
import {requestHttpMethod} from '@lib/src/utils/enums'
import {recommendationInfo, userItem} from '@lib/src/utils/types'
import {recommendations} from '@lib/src/openAI/openAI'
import {error} from 'aws-cdk/lib/logging'
import { validate as uuidValidate } from 'uuid'

export async function returnRecommendations(userId: string): Promise<string | null> {
  const user = await signedAppSyncQuery(getUsersModel, requestHttpMethod.POST, {id: userId})
  const posts = await signedAppSyncQuery(listPostsModels, requestHttpMethod.POST, {limit: 40, filter: { userID: { ne: userId }}})

  const {
    size_tag,
    cloud_provider_tag,
    dev_type_tag,
    framework_tag,
    id,
    lang_tag,
    interest_tag,
    difficulty_tag
  } = user.data.getUsersModel

  const preferenceData: userItem = {
    id: id,
    cloudProviderString: cloud_provider_tag.toString(),
    devTypeString: dev_type_tag.toString(),
    difficultyString: difficulty_tag.toString(),
    frameworkString: framework_tag.toString(),
    interestsString: interest_tag.toString(),
    sizeString: size_tag.toString(),
    languageString: lang_tag.toString()
  }

  return await recommendations(preferenceData, posts)
}

export async function getRecommendationInfo(recs: string | null) {
  const posts = []
  if (recs != null) {
    const parsedData = JSON.parse(recs) as recommendationInfo
    let ids = parsedData.data.id.filter(item => uuidValidate(item))
    ids = [...new Set(ids)]
    for(const id of ids) {
      try {
        const result = await signedAppSyncQuery(getPostsModel, requestHttpMethod.POST, {id: id})
        posts.push(result.data.getPostsModel)
      } catch (e) {
        console.error(e)
      }
    }

    return { data: { items: posts, itemsLength: posts.length } }
  } else {
    return error('Parsed data is null')
  }
}