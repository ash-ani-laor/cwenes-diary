// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const PostsPage = () => {
  return (
    <>
      <Metadata title="Posts" description="Posts page" />

      <h1>PostsPage</h1>
      <p>
        Find me in <code>./web/src/pages/PostsPage/PostsPage.tsx</code>
      </p>
      {/*
          My default route is named `posts`, link to me with:
          `<Link to={routes.posts()}>Posts</Link>`
      */}
    </>
  )
}

export default PostsPage
