//web\src\hooks\useDraftForEditor.ts
import { useQuery } from '@redwoodjs/web'

import { DRAFTS } from 'src/components/GodsAsking/Protocol/draft.gql'
import { DraftTypes } from 'src/constants/draftTypes'

export function useDraftForEditor({ userId, type }) {
  const { data, loading } = useQuery(DRAFTS)

  // Берём черновик по типу и пользователю
  const draft = data?.drafts?.find(
    (d) => d.userId === userId && d.type === type
  )

  return { draft, loading }
}
