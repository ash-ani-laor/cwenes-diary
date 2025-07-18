/**
 * web\src\components\GodsAsking\Protocol\DraftManager.tsx
 */

import React from 'react'

import gql from 'graphql-tag'

import { useMutation, useQuery } from '@redwoodjs/web'

import { DraftTypes } from 'src/constants/draftTypes'
import { useProtocolStore } from 'src/stores/protocolStore'

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

// --- Основной компонент ---
export const DraftManager = ({ type = DraftTypes.PROTOCOL, userId = 1 }) => {
  const { data, loading, refetch } = useQuery(DRAFTS)
  const [createDraft] = useMutation(CREATE_DRAFT)
  const [updateDraft] = useMutation(UPDATE_DRAFT)
  const [deleteDraft] = useMutation(DELETE_DRAFT)

  // Находим свой драфт по типу (можно держать разные!)
  const draft = data?.drafts?.find(
    (d) => d.userId === userId && d.type === type
  )

  // --- Восстановление черновика при входе ---
  React.useEffect(() => {
    if (draft && draft.data) {
      const isRestored = sessionStorage.getItem(`restored-draft-${type}`)
      if (!isRestored) {
        if (
          window.confirm(
            `Обнаружен несохранённый черновик (${type}). Восстановить?`
          )
        ) {
          try {
            const state = JSON.parse(draft.data)
            useProtocolStore.setState({ ...state, divinationId: null })
          } catch {}
        }
        sessionStorage.setItem(`restored-draft-${type}`, 'yes')
      }
    }
  }, [draft, type])

  // --- Автосохранение (раз в минуту) ---
  React.useEffect(() => {
    const interval = setInterval(() => {
      const store = useProtocolStore.getState()
      const serialized = JSON.stringify(store)
      if (draft) {
        updateDraft({
          variables: { id: draft.id, input: { data: serialized } },
        })
      } else {
        createDraft({
          variables: {
            input: { userId, type, data: serialized },
          },
        }).then(() => refetch())
      }
    }, 60000) // раз в минуту (можно сделать чаще)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [draft, type, userId])

  // --- Очистка черновика (вызывай из своей кнопки “очистить”) ---
  const clearDraft = async () => {
    if (draft) {
      await deleteDraft({ variables: { id: draft.id } })
      refetch()
    }
    // + Очистить стор приложения
    useProtocolStore.getState().reset()
    // Сбросить restored-метку для восстановления при новой сессии
    sessionStorage.removeItem(`restored-draft-${type}`)
  }

  // Возвращаем функцию очистки, если хочешь вызвать в другом месте
  return null
}
