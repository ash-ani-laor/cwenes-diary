import type { Divination } from '@prisma/client'

import {
  divinations,
  divination,
  createDivination,
  updateDivination,
  deleteDivination,
} from './divinations'
import type { StandardScenario } from './divinations.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('divinations', () => {
  scenario('returns all divinations', async (scenario: StandardScenario) => {
    const result = await divinations()

    expect(result.length).toEqual(Object.keys(scenario.divination).length)
  })

  scenario(
    'returns a single divination',
    async (scenario: StandardScenario) => {
      const result = await divination({ id: scenario.divination.one.id })

      expect(result).toEqual(scenario.divination.one)
    }
  )

  scenario('creates a divination', async (scenario: StandardScenario) => {
    const result = await createDivination({
      input: {
        userId: scenario.divination.two.userId,
        question: 'String',
        questionFixedTime: '2025-07-06T19:03:08.437Z',
        layout: 'String',
        tags: 'String',
        title: 'String',
      },
    })

    expect(result.userId).toEqual(scenario.divination.two.userId)
    expect(result.question).toEqual('String')
    expect(result.questionFixedTime).toEqual(
      new Date('2025-07-06T19:03:08.437Z')
    )
    expect(result.layout).toEqual('String')
    expect(result.tags).toEqual('String')
    expect(result.title).toEqual('String')
  })

  scenario('updates a divination', async (scenario: StandardScenario) => {
    const original = (await divination({
      id: scenario.divination.one.id,
    })) as Divination
    const result = await updateDivination({
      id: original.id,
      input: { question: 'String2' },
    })

    expect(result.question).toEqual('String2')
  })

  scenario('deletes a divination', async (scenario: StandardScenario) => {
    const original = (await deleteDivination({
      id: scenario.divination.one.id,
    })) as Divination
    const result = await divination({ id: original.id })

    expect(result).toEqual(null)
  })
})
