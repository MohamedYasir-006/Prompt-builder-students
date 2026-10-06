import { Link } from 'react-router-dom'
import { APP_NAME, APP_TAGLINE } from '../config'
import { useAudience } from '../hooks/useAudience'
import { AudienceSwitch } from '../components/audience/AudienceSwitch'
import { Card } from '../components/ui/Card'

export function HomePage() {
  const [audience, setAudience] = useAudience()

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <section aria-labelledby="home-heading" className="flex flex-col gap-3 pt-4">
        <h1 id="home-heading" className="text-3xl font-bold">
          {APP_NAME}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">{APP_TAGLINE}</p>
        <p className="text-base">
          Answer a few short questions and get a ready-to-paste prompt that
          turns any AI chatbot into your personal study helper.
        </p>
      </section>

      <Card>
        <section aria-label="Choose your level" className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">I am a…</h2>
          <AudienceSwitch value={audience} onChange={setAudience} />
        </section>
      </Card>

      <div className="flex flex-col gap-3">
        <Link
          to="/templates"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-5 py-2 text-base font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Browse templates
        </Link>
        <Link
          to="/how-it-works"
          className="text-center text-sm underline underline-offset-4"
        >
          How does a good prompt work?
        </Link>
      </div>
    </div>
  )
}
