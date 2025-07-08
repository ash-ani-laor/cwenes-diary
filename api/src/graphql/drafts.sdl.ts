export const schema = gql`
  type Draft {
    id: Int!
    userId: Int!
    type: String!
    data: String!
    updatedAt: DateTime!
    user: User!
  }

  type Query {
    drafts: [Draft!]! @requireAuth
    draft(id: Int!): Draft @requireAuth
  }

  input CreateDraftInput {
    userId: Int!
    type: String!
    data: String!
  }

  input UpdateDraftInput {
    userId: Int
    type: String
    data: String
  }

  type Mutation {
    createDraft(input: CreateDraftInput!): Draft! @requireAuth
    updateDraft(id: Int!, input: UpdateDraftInput!): Draft! @requireAuth
    deleteDraft(id: Int!): Draft! @requireAuth
  }
`
