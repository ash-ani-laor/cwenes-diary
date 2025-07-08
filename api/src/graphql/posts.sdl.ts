export const schema = gql`
  type Post {
    id: Int!
    userId: Int!
    title: String!
    content: String!
    tags: String!
    type: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    divination: Divination
    divinationId: Int
    user: User!
  }

  type Query {
    posts: [Post!]! @requireAuth
    post(id: Int!): Post @requireAuth
  }

  input CreatePostInput {
    userId: Int!
    title: String!
    content: String!
    tags: String!
    type: String!
    divinationId: Int
  }

  input UpdatePostInput {
    userId: Int
    title: String
    content: String
    tags: String
    type: String
    divinationId: Int
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post! @requireAuth
    updatePost(id: Int!, input: UpdatePostInput!): Post! @requireAuth
    deletePost(id: Int!): Post! @requireAuth
  }
`
