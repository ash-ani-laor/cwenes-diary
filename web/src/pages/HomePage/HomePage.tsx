import { useState } from 'react'

import { Alert } from 'src/components/ui/Alert'
import { Button } from 'src/components/ui/Button'
import { Card } from 'src/components/ui/Card'
import { Dialog, DialogTrigger, DialogContent } from 'src/components/ui/Dialog'
import { StageBox } from 'src/components/ui/StageBox'

const HomePage = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4 p-4">
      <Card>
        <div className="font-bold">Пример карточки</div>
        <div>Контент внутри карточки</div>
      </Card>

      <Button onClick={() => alert('Гав-гав!')}>Нажми меня</Button>
      <Button variant="secondary">Вторичная</Button>
      <Button variant="ghost">Призрачная</Button>

      <Alert>Это алерт с ваэрским посланием!</Alert>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Открыть диалог</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="mb-4">Модалка с ваэрским духом</div>
          <Button onClick={() => setOpen(false)}>Закрыть</Button>
        </DialogContent>
      </Dialog>

      <StageBox>Это Чаша или Тряпочка — бросай сюда плашки!</StageBox>
    </div>
  )
}

export default HomePage
