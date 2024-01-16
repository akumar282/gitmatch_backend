export const getUsersModel = /* GraphQL */ `
    query GetUsersModel($id: ID!) {
        getUsersModel(id: $id) {
            id
            user_name
            email
            lang_tag
            dev_type_tag
            interest_tag
            size_tag
            framework_tag
            difficulty_tag
            cloud_provider_tag
            experience_level
            years_of_experience
            __typename
        }
    }
`

export const listPostsModels = /* GraphQL */ `
  query ListPostsModels(
    $limit: Int
    $nextToken: String
) {
    listPostsModels(limit: $limit, nextToken: $nextToken) {
        items {
            id
            post_title
            description
            long_description
            lang_tag
            dev_type_tag
            interest_tag
            size_tag
            framework_tag
            difficulty_tag
            cloud_provider_tag
            experience_level
            __typename
        }
        nextToken
        __typename
    }
}
`