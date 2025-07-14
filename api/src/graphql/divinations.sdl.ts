export const schema = gql`
  type Divination {
    id: Int!
    userId: Int!
    question: String!
    questionFixedTime: DateTime!
    layout: String!
    tags: String!
    timestamp: DateTime!
    links: String
    previewImage: String
    post: Post
    postId: Int
    user: User!
  }

  type Query {
    divinations: [Divination!]! @requireAuth
    divination(id: Int!): Divination @requireAuth
  }

  input CreateDivinationInput {
    userId: Int!
    question: String!
    questionFixedTime: DateTime!
    layout: String!
    tags: String!
    timestamp: DateTime!
    links: String
    previewImage: String
    postId: Int
  }

  input UpdateDivinationInput {
    userId: Int
    question: String
    questionFixedTime: DateTime
    layout: String
    tags: String
    timestamp: DateTime
    links: String
    previewImage: String
    postId: Int
  }

  type Mutation {
    createDivination(input: CreateDivinationInput!): Divination! @requireAuth
    updateDivination(id: Int!, input: UpdateDivinationInput!): Divination!
      @requireAuth
    deleteDivination(id: Int!): Divination! @requireAuth
  }
`
