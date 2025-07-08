import type { Prisma, Divination } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DivinationCreateArgs>({
  divination: {
    one: {
      data: {
        question: 'String',
        questionFixedTime: '2025-07-06T19:03:08.700Z',
        layout: 'String',
        tags: 'String',
        title: 'String',
        user: { create: { login: 'String2213473', password: 'String' } },
      },
    },
    two: {
      data: {
        question: 'String',
        questionFixedTime: '2025-07-06T19:03:08.731Z',
        layout: 'String',
        tags: 'String',
        title: 'String',
        user: { create: { login: 'String7510042', password: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Divination, 'divination'>
