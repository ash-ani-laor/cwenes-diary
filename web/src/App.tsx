import type { ReactNode } from 'react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import { DialogProvider } from 'src/components/ui/DialogManager'
import { SnackbarProvider } from 'src/components/ui/SnackbarManager'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <SnackbarProvider>
      <DialogProvider>
        <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
          <RedwoodApolloProvider>{children}</RedwoodApolloProvider>
        </RedwoodProvider>
      </DialogProvider>
    </SnackbarProvider>
  </FatalErrorBoundary>
)

export default App
