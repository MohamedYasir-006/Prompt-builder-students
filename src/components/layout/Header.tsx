import { Link, NavLink } from 'react-router-dom'
import { APP_NAME } from '../../config'

export function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold">
          {APP_NAME}
        </Link>
        <nav aria-label="Main navigation" className="flex gap-4 text-sm">
          <NavLink to="/templates" className="underline-offset-4 hover:underline">
            Templates
          </NavLink>
          <NavLink
            to="/how-it-works"
            className="underline-offset-4 hover:underline"
          >
            How it works
          </NavLink>
          <NavLink to="/saved" className="underline-offset-4 hover:underline">
            Saved
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
