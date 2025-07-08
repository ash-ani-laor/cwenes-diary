import type { Draft } from '@prisma/client'

import { drafts, draft, createDraft, updateDraft, deleteDraft } from './drafts'
import type { StandardScenario } from './drafts.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('drafts', () => {
  scenario('returns all drafts', async (scenario: StandardScenario) => {
    const result = await drafts()

    expect(result.length).toEqual(Object.keys(scenario.draft).length)
  })

  scenario('returns a single draft', async (scenario: StandardScenario) => {
    const result = await draft({ id: scenario.draft.one.id })

    expect(result).toEqual(scenario.draft.one)
  })

  scenario('creates a draft', async (scenario: StandardScenario) => {
    const result = await createDraft({
      input: {
        userId: scenario.draft.two.userId,
        type: 'String',
        data: 'String',
      },
    })

    expect(result.userId).toEqual(scenario.draft.two.userId)
    expect(result.type).toEqual('String')
    expect(result.data).toEqual('String')
  })

  scenario('updates a draft', async (scenario: StandardScenario) => {
    const original = (await draft({ id: scenario.draft.one.id })) as Draft
    const result = await updateDraft({
      id: original.id,
      input: { type: 'String2' },
    })

    expect(result.type).toEqual('String2')
  })

  scenario('deletes a draft', async (scenario: StandardScenario) => {
    const original = (await deleteDraft({ id: scenario.draft.one.id })) as Draft
    const result = await draft({ id: original.id })

    expect(result).toEqual(null)
  })
})
