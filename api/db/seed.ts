// api/db/seed.ts
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const postsToCreate = Array.from({ length: 62 }).map((_, idx) => ({
  title: `Запись #${idx + 1}`,
  content: `Это тестовый контент для записи #${idx + 1}.\n\n**Markdown работает!**`,
  tags: JSON.stringify(idx % 2 ? ['тест', 'расклад'] : ['жизнь']),
  type: 'diary',
  createdAt: new Date(Date.now() - idx * 1000 * 60 * 60 * 8).toISOString(),
  updatedAt: new Date(Date.now() - idx * 1000 * 60 * 60 * 8).toISOString(),
  userId: 1,
}))

export default async () => {
  console.log('Seed script started!')
  // Проверим, что пользователь существует
  const user = await db.user.findUnique({ where: { id: 1 } })
  if (!user) {
    await db.user.create({
      data: {
        login: 'testuser',
        password: 'test', // не важно что для тестов
        theme: 'brown',
      },
    })
  }

  for (const post of postsToCreate) {
    await db.post.create({ data: post })
  }
  console.log('Seed complete!')
}
;(async () => {
  await (await import('./seed')).default()
})()
