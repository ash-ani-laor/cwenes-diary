### **1. Проп `commands` — основной способ**

В компонент `<MDEditor />` есть проп `commands`, который принимает массив нужных команд.

**Пример:**

```js
import MDEditor, { commands } from '@uiw/react-md-editor'

<MDEditor
  value={content}
  onChange={setContent}
  commands={[
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.title,
    commands.link,
    commands.quote,
    commands.image,
    // можно добавить свои кастомные команды сюда
  ]}
/>
```

* Оставь только нужные — всё лишнее не появится!

---

### **2. Проп `extraCommands` — если хочешь добавить кнопки справа**

```js
<MDEditor
  value={content}
  onChange={setContent}
  extraCommands={[
    commands.fullscreen,
    // свои кастомные команды
  ]}
/>
```

---

### **3. Можно комбинировать**

```js
<MDEditor
  value={content}
  onChange={setContent}
  commands={[
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.title,
    commands.link,
    commands.quote,
    commands.image,
  ]}
  extraCommands={[
    commands.codeEdit,
    commands.codeLive,
    commands.codePreview,
    commands.fullscreen,
  ]}
/>
```

---

### **4. Кастомные кнопки**

Ты можешь добавить свой объект-команду:

```js
const myCommand = {
  name: 'custom',
  keyCommand: 'custom',
  buttonProps: { 'aria-label': 'Моя кнопка' },
  icon: <MyIcon />, // твой React-иконка
  execute: (state, api) => {
    // Вставить что-нибудь
    api.replaceSelection('✨Магия!')
  }
}
```

И вставить её в commands или extraCommands.

---

### **5. Полный список стандартных команд**

* `commands.bold`
* `commands.italic`
* `commands.strikethrough`
* `commands.hr`
* `commands.title`
* `commands.divider`
* `commands.link`
* `commands.quote`
* `commands.code`
* `commands.image`
* `commands.unorderedListCommand`
* `commands.orderedListCommand`
* `commands.checkedListCommand`
* `commands.codeEdit`
* `commands.codeLive`
* `commands.codePreview`
* `commands.fullscreen`
* ...

---

### **6. Пример “только самые нужные”**

```js
<MDEditor
  value={content}
  onChange={setContent}
  commands={[
    commands.bold,
    commands.italic,
    commands.hr,
    commands.link,
    commands.image
  ]}
  extraCommands={[commands.fullscreen]}
/>
```

---

## **Официальная дока:**

[https://github.com/uiwjs/react-md-editor#commands](https://github.com/uiwjs/react-md-editor#commands)
