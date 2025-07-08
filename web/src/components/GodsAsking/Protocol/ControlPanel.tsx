/*
 * web/src/components/Protocol/ControlPanel.tsx
 */
import React from 'react'

import { Trash2, Link2 } from 'lucide-react'

import { Button } from 'src/components/ui/Button'
import { useProtocolStore } from 'src/stores/protocolStore'

const ControlPanel = () => {
  const { reset, toggleAddLinkMode } = useProtocolStore()

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={reset} title="Очистить">
        <Trash2 />
      </Button>
      <Button onClick={toggleAddLinkMode} title="Добавить линию">
        <Link2 />
      </Button>
    </div>
  )
}

export default ControlPanel
