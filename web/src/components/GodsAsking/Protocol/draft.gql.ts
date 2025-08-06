// --- GQL ---
const DRAFTS = gql`
  query Drafts {
    drafts {
      id
      userId
      type
      data
      updatedAt
    }
  }
`

const CREATE_DRAFT = gql`
  mutation CreateDraft($input: CreateDraftInput!) {
    createDraft(input: $input) {
      id
      data
      updatedAt
    }
  }
`

const UPDATE_DRAFT = gql`
  mutation UpdateDraft($id: Int!, $input: UpdateDraftInput!) {
    updateDraft(id: $id, input: $input) {
      id
      data
      updatedAt
    }
  }
`

const DELETE_DRAFT = gql`
  mutation DeleteDraft($id: Int!) {
    deleteDraft(id: $id) {
      id
    }
  }
`

export { DRAFTS, CREATE_DRAFT, UPDATE_DRAFT, DELETE_DRAFT }
