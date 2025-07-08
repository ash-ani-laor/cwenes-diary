import { render } from '@redwoodjs/testing/web'

import DivinationsPage from './DivinationsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('DivinationsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DivinationsPage />)
    }).not.toThrow()
  })
})
