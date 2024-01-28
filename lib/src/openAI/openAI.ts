import * as OpenAI from 'openai'
import {getOpenAIKey, getOrgID} from '@lib/src/utils/utils'
import {userItem} from '@lib/src/utils/types'

export const openAIClient = new OpenAI.OpenAI({
  organization: getOrgID(),
  apiKey: getOpenAIKey()
})

export async function recommendations(userData: userItem, listPosts: object) {
  const data = JSON.stringify({userData, listPosts})
  const completion = await openAIClient.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a recommendation system made for GitMatch. 
           Your job is to match a user with open-source software projects to work on that match their preferences. 
           You will be provided with a JSON object of a user and their preferences as well as a JSON object of 
           projects with their tags and descriptions. Match the user to projects as good as you can and return one 
           message with a single JSON object with a field of 10 project IDs in an array, as well as a single field 
           with your justification of why each one is a good match. 
           Like this: { data: { id: [array of ids], justification: string } }  .
           Make sure you return 10 ids regardless of the number of projects you are provided with. 
           You are meant to return JSON. `,
      },
      { role: 'user', content: `${data}` },
    ],
    model: 'gpt-3.5-turbo-1106',
    response_format: { type: 'json_object' },
  })
  return completion.choices[0].message.content
}