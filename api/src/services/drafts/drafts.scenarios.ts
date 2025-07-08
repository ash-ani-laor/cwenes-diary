import type { Prisma, Draft } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DraftCreateArgs>({
  draft: {
    one: {
      data: {
        type: 'String',
        data: 'String',
        user: { create: { login: 'String7902384', password: 'String' } },
      },
    },
    two: {
      data: {
        type: 'String',
        data: 'String',
        user: { create: { login: 'String8649544', password: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Draft, 'draft'>
