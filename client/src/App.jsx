import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout/Layout.jsx'
import { HomePage } from './pages/HomePage/HomePage.jsx'
import { SearchPage } from './pages/SearchPage/SearchPage.jsx'
import { ListingPage } from './pages/ListingPage/ListingPage.jsx'
import { UiPage } from './pages/UiPage/UiPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage.jsx'


function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="listing/:id" element={<ListingPage />} />
          <Route path="/ui" element={<UiPage />} />
          <Route path="*" element={<NotFoundPage />} />
        
        </Route>
      </Routes>
    </>
  )
}

export default App
