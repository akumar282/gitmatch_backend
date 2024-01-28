import {signedAppSyncQuery} from '@lib/src/utils/requests'
import {getUsersModel, listPostsModels} from '@lib/src/graphql/queries'
import {requestHttpMethod} from '@lib/src/utils/enums'
import {userItem} from '@lib/src/utils/types'
import {recommendations} from '@lib/src/openAI/openAI'

export async function returnRecommendations(userId: string): Promise<string | null> {
  const user = await signedAppSyncQuery(getUsersModel, requestHttpMethod.POST, {id: userId})
  const posts = await signedAppSyncQuery(listPostsModels, requestHttpMethod.POST, {limit: 40})

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