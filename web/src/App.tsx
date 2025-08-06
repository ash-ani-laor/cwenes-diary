/**
 * web/src/App.tsx
 */

import React, { useState } from 'react'
import type { ReactNode } from 'react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import AboutWindow from 'src/components/ui/AboutWindow'
import { CommandBar } from 'src/components/ui/CommandBar'
import { DialogProvider } from 'src/components/ui/DialogManager'
import { SnackbarProvider } from 'src/components/ui/SnackbarManager'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <FatalErrorBoundary page={FatalErrorPage}>
      <SnackbarProvider>
        <DialogProvider>
          <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
            <RedwoodApolloProvider>
              <CommandBar onOpenOR={() => setShowAbout(true)} />
              {/* Контент страницы */}
              <div style={{ paddingTop: 32 }}>{children}</div>
              {/* Глобальные окна */}
              {showAbout && <AboutWindow onClose={() => setShowAbout(false)} />}
            </RedwoodApolloProvider>
          </RedwoodProvider>
        </DialogProvider>
      </SnackbarProvider>
    </FatalErrorBoundary>
  )
}

export default App
