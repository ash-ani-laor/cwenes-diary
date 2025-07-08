import type { Prisma, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: { data: { login: 'String6866984', password: 'String' } },
    two: { data: { login: 'String4548053', password: 'String' } },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
