# ✅ Инструкция по сидированию (seed) данных в RedwoodJS на Windows

## Структура файлов

- `api/db/seed.ts` — сам сидер (основной файл для генерации данных)
- `api/db/tsconfig.json` — отдельный tsconfig для сидера (опционально, но рекомендуется!)

## tsconfig.json (пример для сидера)

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": false,
    "types": ["node"]
  }
}
````

## Пример seed.ts

```ts
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

  // Проверим, что пользователь существует (если нет — создаём)
  const user = await db.user.findUnique({ where: { id: 1 } })
  if (!user) {
    await db.user.create({
      data: {
        login: 'testuser',
        password: 'test', // Для тестов
        theme: 'brown',
      },
    })
  }

  for (const post of postsToCreate) {
    await db.post.create({ data: post })
  }

  console.log('Seed complete!')
}
```

---

## Как запускать сидер (важно!):

**Запускать всегда из папки `/api`!**

```bash
npx ts-node --project db/tsconfig.json db/seed.ts
```

или если в package.json указано:

```json
"prisma": {
  "seed": "ts-node --project db/tsconfig.json db/seed.ts"
}
```

то просто:

```bash
yarn rw prisma db seed
```

---

## Проверка результата

1. Запусти Prisma Studio:

   ```
   yarn rw prisma studio
   ```
2. Открой базу данных и убедись, что все записи появились!

---

## Важные замечания

* Никогда не запускай сидер “просто так” из /api/db (без указания --project и полного пути).
* Для каждого нового проекта рекомендуется отдельный tsconfig для сидера.
* Не забывай, что в Redwood проекте структура путей и конфигов может влиять на видимость модулей.

