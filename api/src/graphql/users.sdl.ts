export const schema = gql`
  type User {
    id: Int!
    login: String!
    password: String!
    theme: String!
    motto: String
    posts: [Post]!
    divinations: [Divination]!
    drafts: [Draft]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    login: String!
    password: String!
    theme: String!
    motto: String
  }

  input UpdateUserInput {
    login: String
    password: String
    theme: String
    motto: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`
