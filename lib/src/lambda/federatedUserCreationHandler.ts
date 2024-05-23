import {Context, PreSignUpTriggerEvent} from 'aws-lambda'
import {signedAppSyncQuery} from '@lib/src/utils/requests'
import {createUsersModel} from '@lib/src/graphql/queries'
import {requestHttpMethod} from '@lib/src/utils/enums'

export async function handler(event: PreSignUpTriggerEvent, context: Context) {
  try {
    if(event.triggerSource === 'PreSignUp_ExternalProvider') {
      console.log('presignup if was hit')
      if(
        Object.prototype.hasOwnProperty.call(event.request.userAttributes, 'custom:id') &&
        Object.prototype.hasOwnProperty.call(event.request.userAttributes, 'email')
      ) {
        console.log('second if was hit')

        const id = event.request.userAttributes['custom:id']
        const email = event.request.userAttributes['email']
        const input = {
          input: {
            id: id,
            user_name: 'google_notSet',
            email: email,
            password: 'password',
            profile_image: 'defaultimg4.JPG',
            user_creation_date: new Date().toISOString(),
            lang_tag: [],
            dev_type_tag: [],
            interest_tag: [],
            size_tag: [],
            framework_tag: [],
            difficulty_tag: [],
            cloud_provider_tag: [],
            liked_posts: [],
            saved_posts: [],
            hide_posts: [],
            involved_projects: [],
            experience_level: [],
            new_user: true,
            oauth_provider: 'GOOGLE',
            oauth_id: id,
            notification_type: 'EMAIL_AND_NEWSLETTER'
          }
        }
        const result = await signedAppSyncQuery(createUsersModel, requestHttpMethod.POST, input)
        console.log(result)
        return event
      }
    } else {
      return event
    }
  } catch (e) {
    console.log(e)
    console.log(event)
    console.log(context)
  }
  return {
    headers: { 'Content-Type': 'application/json' },
    statusCode: 301,
    body: JSON.stringify('Lambda executed with result')
  }
}