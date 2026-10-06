import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SavedPrompt } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { MAX_PROMPT_NAME_LENGTH } from '../../hooks/useSavedPrompts'

interface SavedPromptListProps {
  prompts: SavedPrompt[]
  onOpen: (prompt: SavedPrompt) => void
  onRename: (id: string, name: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

/** Saved prompts with open, rename, duplicate, and confirmed delete. */
export function SavedPromptList({
  prompts,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: SavedPromptListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  if (prompts.length === 0) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-bold">No saved prompts yet</h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Answer a few questions and save the prompt you like — it will wait
          for you here on this device.
        </p>
        <Link
          to="/templates"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-5 py-2 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-slate-100 dark:text-slate-900"
        >
          Browse templates
        </Link>
      </Card>
    )
  }

  function startRename(prompt: SavedPrompt) {
    setEditingId(prompt.id)
    setDraftName(prompt.name)
    setConfirmingId(null)
  }

  function commitRename(id: string) {
    if (draftName.trim() !== '') onRename(id, draftName)
    setEditingId(null)
  }

  return (
    <ul className="flex flex-col gap-3">
      {prompts.map((prompt) => (
        <li key={prompt.id}>
          <Card className="flex flex-col gap-2">
            {editingId === prompt.id ? (
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  commitRename(prompt.id)
                }}
              >
                <label
                  htmlFor={`rename-${prompt.id}`}
                  className="text-sm font-semibold"
                >
                  Prompt name
                </label>
                <input
                  id={`rename-${prompt.id}`}
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  maxLength={MAX_PROMPT_NAME_LENGTH}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base dark:border-slate-700 dark:bg-slate-950"
                />
                <div className="flex gap-2">
                  <Button type="submit">Save name</Button>
                  <Button variant="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-lg font-bold">{prompt.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Updated{' '}
                  {new Date(prompt.updatedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => onOpen(prompt)}>Open</Button>
                  <Button variant="secondary" onClick={() => startRename(prompt)}>
                    Rename
                  </Button>
                  <Button variant="secondary" onClick={() => onDuplicate(prompt.id)}>
                    Duplicate
                  </Button>
                  {confirmingId === prompt.id ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          onDelete(prompt.id)
                          setConfirmingId(null)
                        }}
                      >
                        Confirm delete
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setConfirmingId(null)}
                      >
                        Keep it
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => setConfirmingId(prompt.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </>
            )}
          </Card>
        </li>
      ))}
    </ul>
  )
}
