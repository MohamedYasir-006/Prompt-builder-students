import { useNavigate } from 'react-router-dom'
import { SavedPromptList } from '../components/saved/SavedPromptList'
import { useSavedPrompts } from '../hooks/useSavedPrompts'
import type { SavedPrompt } from '../types'

export function SavedPage() {
  const { saved, rename, duplicate, remove } = useSavedPrompts()
  const navigate = useNavigate()

  function handleOpen(prompt: SavedPrompt) {
    navigate('/result', {
      state: {
        templateId: prompt.templateId,
        audience: prompt.audience,
        answers: prompt.answers,
      },
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Saved prompts</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Your saved prompts live only in this browser — open, rename,
          duplicate, or delete them any time.
        </p>
      </div>
      <SavedPromptList
        prompts={saved}
        onOpen={handleOpen}
        onRename={rename}
        onDuplicate={duplicate}
        onDelete={remove}
      />
    </div>
  )
}
