// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const DraftsPage = () => {
  return (
    <>
      <Metadata title="Drafts" description="Drafts page" />

      <h1>DraftsPage</h1>
      <p>
        Find me in <code>./web/src/pages/DraftsPage/DraftsPage.tsx</code>
      </p>
      {/*
          My default route is named `drafts`, link to me with:
          `<Link to={routes.drafts()}>Drafts</Link>`
      */}
    </>
  )
}

export default DraftsPage
