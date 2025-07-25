// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const UsersPage = () => {
  return (
    <>
      <Metadata title="Users" description="Users page" />

      <h1>UsersPage</h1>
      <p>
        Find me in <code>./web/src/pages/UsersPage/UsersPage.tsx</code>
      </p>
      {/*
          My default route is named `users`, link to me with:
          `<Link to={routes.users()}>Users</Link>`
      */}
    </>
  )
}

export default UsersPage
