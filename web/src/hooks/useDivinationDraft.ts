//web\src\hooks\useDivinationDraft.ts
import { useEffect, useRef } from 'react'

import { useMutation } from '@redwoodjs/web'

import { DraftTypes } from 'src/constants/draftTypes'

import {
  UPDATE_DRAFT,
  CREATE_DRAFT,
} from '../components/GodsAsking/Protocol/draft.gql'

export function useDivinationDraft({ userId, draft, values, loading }) {
  const [updateDraft] = useMutation(UPDATE_DRAFT)
  const [createDraft] = useMutation(CREATE_DRAFT)

  const prevSerialized = useRef('')

  useEffect(() => {
    if (loading) return // <--- вот эта строка!
    const serialized = JSON.stringify(values)
    if (serialized !== prevSerialized.current) {
      prevSerialized.current = serialized
      if (draft && draft.id) {
        updateDraft({
          variables: { id: draft.id, input: { data: serialized } },
        })
      } else {
        createDraft({
          variables: {
            input: { userId, type: DraftTypes.PROTOCOL, data: serialized },
          },
        })
      }
    }
  }, [loading, values, draft, userId, updateDraft, createDraft])
}
