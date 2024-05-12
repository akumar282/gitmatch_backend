export const getUsersModel = `
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

export const listPostsModels = `
  query ListPostsModels(
    $filter: ModelPostsModelFilterInput
    $limit: Int
    $nextToken: String
) {
    listPostsModels(filter: $filter, limit: $limit, nextToken: $nextToken) {
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

export const getPostsModel = `
    query GetPostsModel($id: ID!) {
        getPostsModel(id: $id) {
            id
            post_title
            description
            long_description
            project_link
            image_link
            post_date
            userID
            creator_name
            lang_tag
            dev_type_tag
            interest_tag
            size_tag
            framework_tag
            difficulty_tag
            cloud_provider_tag
            likes
            likes_users
            saves
            post_comments {
                nextToken
                __typename
            }
            contributor_limit
            reported
            experience_level
            application
            project_chat
            createdAt
            updatedAt
            __typename
        }
    }
`