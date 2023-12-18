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