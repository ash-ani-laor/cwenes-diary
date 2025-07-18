/**
 * web\src\components\ui\SnackbarManager.tsx
 */

import React, { createContext, useCallback, useContext, useState } from 'react'

import MuiAlert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

type SnackbarConfig = {
  message: string
  severity?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

type SnackbarContextType = {
  showSnackbar: (config: SnackbarConfig) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
)

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext)
  if (!ctx)
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  return ctx
}

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<SnackbarConfig>({
    message: '',
    severity: 'info',
    duration: 3000,
  })

  const showSnackbar = useCallback((snackbarConfig: SnackbarConfig) => {
    setConfig({ severity: 'info', duration: 3000, ...snackbarConfig })
    setOpen(true)
  }, [])

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={config.duration}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={config.severity}
          sx={{ width: '100%' }}
          onClose={() => setOpen(false)}
        >
          {config.message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
