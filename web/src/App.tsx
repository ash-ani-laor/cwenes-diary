/**
 * web/src/App.tsx
 */

import React from 'react'
import type { ReactNode } from 'react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import StageBox from 'src/components/GodsAsking/Protocol/StageBox' // для примера, потом подгоним под read-only
import { CommandBar } from 'src/components/ui/CommandBar'
import { DialogProvider } from 'src/components/ui/DialogManager'
import { FloatingWindow } from 'src/components/ui/FloatingWindow'
import { SnackbarProvider } from 'src/components/ui/SnackbarManager'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import { useWindowManager } from 'src/stores/windowManager'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => {
  const orWindow = useWindowManager((s) => s.windows['OR'] || {})
  const openWindow = useWindowManager((s) => s.openWindow)
  const closeWindow = useWindowManager((s) => s.closeWindow)

  return (
    <FatalErrorBoundary page={FatalErrorPage}>
      <SnackbarProvider>
        <DialogProvider>
          <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
            <RedwoodApolloProvider>
              <CommandBar onOpenOR={() => openWindow('OR')} />
              {/* Контент страницы */}
              <div style={{ paddingTop: 32 }}>{children}</div>
              {/* Глобальные окна */}
              {orWindow.visible && (
                <FloatingWindow
                  title="Окно Расклада"
                  onClose={() => closeWindow('OR')}
                  width={orWindow.width}
                  height={orWindow.height}
                  initialPosition={{ x: orWindow.x, y: orWindow.y }}
                >
                  <StageBox readOnly />
                </FloatingWindow>
              )}{' '}
            </RedwoodApolloProvider>
          </RedwoodProvider>
        </DialogProvider>
      </SnackbarProvider>
    </FatalErrorBoundary>
  )
}

export default App
