import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:p-2"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
