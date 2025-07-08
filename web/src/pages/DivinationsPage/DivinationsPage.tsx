// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const DivinationsPage = () => {
  return (
    <>
      <Metadata title="Divinations" description="Divinations page" />

      <h1>DivinationsPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/DivinationsPage/DivinationsPage.tsx</code>
      </p>
      {/*
          My default route is named `divinations`, link to me with:
          `<Link to={routes.divinations()}>Divinations</Link>`
      */}
    </>
  )
}

export default DivinationsPage
