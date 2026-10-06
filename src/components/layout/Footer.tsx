import { APP_NAME } from '../../config'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-slate-500">
        <p>
          {APP_NAME} — prompts are generated on your device. Saved prompts stay
          in your browser.
        </p>
      </div>
    </footer>
  )
}
