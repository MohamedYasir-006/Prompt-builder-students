import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { BuilderPage } from './pages/BuilderPage'
import { HomePage } from './pages/HomePage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ResultPage } from './pages/ResultPage'
import { SavedPage } from './pages/SavedPage'
import { TemplatesPage } from './pages/TemplatesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'build/:templateId', element: <BuilderPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: 'saved', element: <SavedPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
