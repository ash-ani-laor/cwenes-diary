import type {
  QueryResolvers,
  MutationResolvers,
  DivinationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const divinations: QueryResolvers['divinations'] = () => {
  return db.divination.findMany()
}

export const divination: QueryResolvers['divination'] = ({ id }) => {
  return db.divination.findUnique({
    where: { id },
  })
}

export const createDivination: MutationResolvers['createDivination'] = ({
  input,
}) => {
  return db.divination.create({
    data: input,
  })
}

export const updateDivination: MutationResolvers['updateDivination'] = ({
  id,
  input,
}) => {
  return db.divination.update({
    data: input,
    where: { id },
  })
}

export const deleteDivination: MutationResolvers['deleteDivination'] = ({
  id,
}) => {
  return db.divination.delete({
    where: { id },
  })
}

export const Divination: DivinationRelationResolvers = {
  post: (_obj, { root }) => {
    return db.divination.findUnique({ where: { id: root?.id } }).post()
  },
  user: (_obj, { root }) => {
    return db.divination.findUnique({ where: { id: root?.id } }).user()
  },
}
