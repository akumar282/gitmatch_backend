import {mockData} from './consts'
import {getRecommendationInfo} from '@lib/src/functions/functions'

test('Get posts from recs', async () => {
  const result = await getRecommendationInfo(mockData)
  console.log(result)
  expect(result)
})