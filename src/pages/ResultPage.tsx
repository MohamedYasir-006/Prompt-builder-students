import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getTemplateById } from '../data/templates'
import { useSavedPrompts } from '../hooks/useSavedPrompts'
import { buildPrompt } from '../lib/promptBuilder'
import {
  decodeShareData,
  validateAnswersForTemplate,
  type ShareData,
} from '../lib/share'
import type { Answers, Audience, Template } from '../types'
import { CopyButton } from '../components/result/CopyButton'
import { PromptPreview } from '../components/result/PromptPreview'
import { ShareButton } from '../components/result/ShareButton'
import { TestIdeas } from '../components/result/TestIdeas'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Toast } from '../components/ui/Toast'

interface ResultLocationState {
  templateId?: unknown
  audience?: unknown
  answers?: unknown
}

interface ResolvedResult {
  status: 'empty' | 'invalid' | 'ok'
  template?: Template
  audience?: Audience
  answers?: Answers
  error?: string
}

function isAnswers(value: unknown): value is Answers {
  if (typeof value !== 'object' || value === null) return false
  return Object.values(value as Record<string, unknown>).every(
    (v) =>
      typeof v === 'string' ||
      (Array.isArray(v) && v.every((item) => typeof item === 'string')),
  )
}

function isAudience(value: unknown): value is Audience {
  return value === 'school' || value === 'college'
}

/** Resolve /result input: shared #data hash wins, else navigation state. */
function resolveResult(
  hash: string,
  state: ResultLocationState | null,
): ResolvedResult {
  const hasHash = hash.includes('data=')
  let candidate: ShareData | null

  if (hasHash) {
    candidate = decodeShareData(hash)
    if (candidate === null) {
      return {
        status: 'invalid',
        error:
          'This share link looks broken — we could not read the answers from it. Ask for a fresh link, or build your own prompt instead.',
      }
    }
  } else if (
    state !== null &&
    typeof state.templateId === 'string' &&
    isAudience(state.audience) &&
    isAnswers(state.answers)
  ) {
    candidate = {
      templateId: state.templateId,
      audience: state.audience,
      answers: state.answers,
    }
  } else {
    return { status: 'empty' }
  }

  const template = getTemplateById(candidate.templateId)
  if (template === undefined) {
    return {
      status: 'invalid',
      error:
        'This link points to a template that no longer exists. Pick a current template and build a fresh prompt.',
    }
  }
  const problem = validateAnswersForTemplate(
    template,
    candidate.audience,
    candidate.answers,
  )
  if (problem !== null) {
    return { status: 'invalid', error: problem }
  }
  return {
    status: 'ok',
    template,
    audience: candidate.audience,
    answers: candidate.answers,
  }
}

export function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { save } = useSavedPrompts()
  const [promptName, setPromptName] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const resolved = resolveResult(
    location.hash,
    (location.state as ResultLocationState | null) ?? null,
  )

  if (resolved.status === 'empty') {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-3 pt-8">
        <h1 className="text-2xl font-bold">No prompt yet</h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Pick a template and answer a few short questions — your finished
          prompt will appear here, ready to copy.
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

  if (resolved.status === 'invalid' || resolved.template === undefined) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-3 pt-8">
        <h1 className="text-2xl font-bold">This link did not work</h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          {resolved.error ??
            'Something is wrong with this link. Try building a fresh prompt instead.'}
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

  const template = resolved.template
  const audience = resolved.audience ?? 'school'
  const answers = resolved.answers ?? {}
  const generated = buildPrompt(template, answers, audience)
  const shareData: ShareData = {
    templateId: template.id,
    audience,
    answers,
  }

  function handleEdit() {
    navigate(`/build/${template.id}`, { state: { answers } })
  }

  function handleSave() {
    const name = promptName.trim() === '' ? template.title : promptName
    const entry = save(name, template.id, audience, answers)
    if (entry === null) {
      setSaveMessage(
        'Could not save — give the prompt a name, or delete an old one first.',
      )
    } else {
      setSaveMessage(`Saved “${entry.name}”. Find it on the Saved page.`)
      setPromptName('')
    }
    window.setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">
          {template.icon} {template.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Copy this prompt into any AI chatbot to start learning.
        </p>
      </div>

      <PromptPreview sections={generated.sections} />

      <p
        role="note"
        className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
      >
        AI chatbots can make mistakes. Check important facts.
      </p>

      <div className="flex flex-wrap gap-3">
        <CopyButton text={generated.fullText} />
        <Button variant="secondary" onClick={handleEdit}>
          Edit answers
        </Button>
      </div>

      <Card>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <label htmlFor="save-name" className="text-base font-semibold">
            Save this prompt
          </label>
          <input
            id="save-name"
            type="text"
            value={promptName}
            onChange={(e) => setPromptName(e.target.value)}
            placeholder={`e.g. ${template.title} — my version`}
            maxLength={80}
            className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base dark:border-slate-700 dark:bg-slate-950"
          />
          <div>
            <Button type="submit" variant="secondary">
              Save prompt
            </Button>
          </div>
        </form>
      </Card>

      <ShareButton data={shareData} />

      <TestIdeas
        sampleQuestions={template.sampleQuestions}
        improveTips={template.improveTips}
      />
      <Toast message={saveMessage} />
    </div>
  )
}
