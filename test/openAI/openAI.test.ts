import {recommendations} from '@lib/src/openAI/openAI'
import {userItem} from '@lib/src/utils/types'

test('OpenAI test', async () => {
  const user: userItem = {
    id: '34',
    languageString: 'TYPESCRIPT,PYTHON',
    devTypeString: 'BACKEND,MOBILE_APP,FULL_STACK',
    frameworkString: 'EXPRESS',
    cloudProviderString: 'AMAZON_WEB_SERVICES',
    interestsString: null,
    sizeString: null,
    difficultyString: null
  }

  const post = {
    'id': '354',
    'cloud_provider_tag': [
      'AMAZON_WEB_SERVICES'
    ],
    'description': '',
    'dev_type_tag': [
      'COMPUTING'
    ],
    'difficulty_tag': [
      'GOOD_FIRST_PROJECT'
    ],
    'experience_level': [
      'BEGINNER'
    ],
    'framework_tag': [
      'YII'
    ],
    'interest_tag': [
      'COMMUNICATION'
    ],
    'lang_tag': [
      'C'
    ],
    'long_description': '',
    'post_title': '',
    'size_tag': [
      'SMALL'
    ],
    '__typename': 'PostsModel'
  }

  const result = await recommendations(user, post)
  console.log(result)
  expect(result)
})