import type { Prisma, Post } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PostCreateArgs>({
  post: {
    one: {
      data: {
        title: 'String',
        content: 'String',
        tags: 'String',
        updatedAt: '2025-07-06T19:02:42.509Z',
        user: { create: { login: 'String4849111', password: 'String' } },
      },
    },
    two: {
      data: {
        title: 'String',
        content: 'String',
        tags: 'String',
        updatedAt: '2025-07-06T19:02:42.540Z',
        user: { create: { login: 'String9123907', password: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Post, 'post'>
