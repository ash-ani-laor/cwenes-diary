import type {
  QueryResolvers,
  MutationResolvers,
  DraftRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const drafts: QueryResolvers['drafts'] = () => {
  return db.draft.findMany()
}

export const draft: QueryResolvers['draft'] = ({ id }) => {
  return db.draft.findUnique({
    where: { id },
  })
}

export const createDraft: MutationResolvers['createDraft'] = ({ input }) => {
  return db.draft.create({
    data: input,
  })
}

export const updateDraft: MutationResolvers['updateDraft'] = ({
  id,
  input,
}) => {
  return db.draft.update({
    data: input,
    where: { id },
  })
}

export const deleteDraft: MutationResolvers['deleteDraft'] = ({ id }) => {
  return db.draft.delete({
    where: { id },
  })
}

export const Draft: DraftRelationResolvers = {
  user: (_obj, { root }) => {
    return db.draft.findUnique({ where: { id: root?.id } }).user()
  },
}
