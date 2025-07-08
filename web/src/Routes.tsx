// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Route path="/protocol" page={ProtocolPage} name="protocol" />

      <Route path="/users" page={UsersPage} name="users" />
      <Route path="/drafts" page={DraftsPage} name="drafts" />
      <Route path="/posts" page={PostsPage} name="posts" />
      <Route path="/divinations" page={DivinationsPage} name="divinations" />
      <Route path="/" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
