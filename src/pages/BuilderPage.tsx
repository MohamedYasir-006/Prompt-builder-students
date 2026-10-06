import { Link, useNavigate, useParams } from 'react-router-dom'
import { StepForm } from '../components/builder/StepForm'
import { getTemplateById } from '../data/templates'
import { useAudience } from '../hooks/useAudience'
import type { Answers } from '../types'

export function BuilderPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [audience] = useAudience()
  const template =
    templateId !== undefined ? getTemplateById(templateId) : undefined

  if (template === undefined) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-3 pt-8">
        <h1 className="text-2xl font-bold">Template not found</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Sorry, we could not find that template. It may have been renamed —
          pick another one to keep going.
        </p>
        <Link
          to="/templates"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-5 py-2 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-slate-100 dark:text-slate-900"
        >
          Browse templates
        </Link>
      </div>
    )
  }

  const effectiveAudience = template.audiences.includes(audience)
    ? audience
    : template.audiences[0]

  function handleComplete(answers: Answers) {
    navigate('/result', {
      state: {
        templateId: template?.id,
        audience: effectiveAudience,
        answers,
      },
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">
          {template.icon} {template.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {template.description}
        </p>
      </div>
      <StepForm template={template} onComplete={handleComplete} />
    </div>
  )
}
