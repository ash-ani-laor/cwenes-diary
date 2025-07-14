import React, { createContext, useCallback, useContext, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'

type DialogConfig = {
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

type DialogContextType = {
  showDialog: (config: DialogConfig) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export const useDialog = () => {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider')
  return ctx
}

export const DialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<DialogConfig>({
    message: '',
    confirmText: 'ОК',
    cancelText: 'Отмена',
  })

  const showDialog = useCallback(
    (dialogConfig: DialogConfig) => {
      setConfig({
        cancelText: 'Отмена',
        confirmText: 'ОК',
        ...dialogConfig,
      })
      setOpen(true)
    },
    [setConfig, setOpen]
  )

  const handleConfirm = () => {
    setOpen(false)
    config.onConfirm && config.onConfirm()
  }

  const handleCancel = () => {
    setOpen(false)
    config.onCancel && config.onCancel()
  }

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>{config.message}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {config.cancelText}
          </Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
            {config.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  )
}
