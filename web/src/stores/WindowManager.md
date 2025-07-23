# WindowManager (Менеджер Плавающих Окон)

---

## Основная идея

**WindowManager** — это zustand-store, управляющий всеми “внутренними окнами” приложения (Окно Расклада, дневник, часы и др).

- Хранит:
  - Открыто/закрыто
  - Координаты (x, y)
  - Размер (width, height)
  - Свернутость
  - payload (контент, например id расклада)

---

## 1. API WindowManager

```ts
export interface WindowState {
  id: string
  visible: boolean
  minimized: boolean
  x: number
  y: number
  width: number
  height: number
  payload?: any
}

interface WindowManagerState {
  windows: Record<string, WindowState>
  openWindow: (id: string, payload?: any) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string, minimized?: boolean) => void
  moveWindow: (id: string, x: number, y: number) => void
  setWindowPayload: (id: string, payload: any) => void
}
````

---

## 2. Использование в App

```ts
import { useWindowManager } from 'src/stores/windowManager'

const orWindow = useWindowManager((s) => s.windows['OR'] || {})
const openWindow = useWindowManager((s) => s.openWindow)
const closeWindow = useWindowManager((s) => s.closeWindow)
```

**Открыть окно с payload (например, id расклада):**

```js
openWindow('OR', { divinationId: 10 })
```

---

## 3. Встраивание в JSX

```tsx
<CommandBar onOpenOR={() => openWindow('OR', { divinationId: 10 })} />

{orWindow.visible && (
  <FloatingWindow
    title="Окно Расклада"
    onClose={() => closeWindow('OR')}
    width={orWindow.width}
    height={orWindow.height}
    initialPosition={{ x: orWindow.x, y: orWindow.y }}
  >
    <ORContent divinationId={orWindow.payload?.divinationId} />
  </FloatingWindow>
)}
```

---

## 4. ORContent: загрузка расклада по divinationId

```tsx
import { useQuery, gql } from '@redwoodjs/web'

const GET_DIVINATION = gql`
  query FindDivinationById($id: Int!) {
    divination(id: $id) {
      id
      layout
      question
    }
  }
`

const ORContent = ({ divinationId }) => {
  if (!divinationId) return <div>Нет выбранного расклада</div>
  const { data, loading, error } = useQuery(GET_DIVINATION, { variables: { id: divinationId } })
  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка загрузки</div>
  const layout = JSON.parse(data.divination.layout)
  return <StageBox readOnly {...layout} />
}
```

---

## 5. Use Case: открыть Окно Расклада с раскладом ID=10

```js
openWindow('OR', { divinationId: 10 })
```

ORContent загрузит расклад с этим id и отрисует его readOnly.

---

## 6. Примеры расширения

* Можно передавать через payload не только id, но и другие параметры (например, режим “выбора символа” для вставки ссылки).
* Любое новое окно — по тому же принципу:

  ```js
  openWindow('Diary', { entryId: 5 })
  ```

---

**Всё управление окнами — через WindowManager!**

