import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SavedPromptList } from './SavedPromptList'
import type { SavedPrompt } from '../../types'

const prompt: SavedPrompt = {
  id: 'p1',
  name: 'My maths bot',
  templateId: 'homework-helper',
  audience: 'school',
  answers: { subject: 'maths' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function renderList(props?: Partial<Parameters<typeof SavedPromptList>[0]>) {
  return render(
    <MemoryRouter>
      <SavedPromptList
        prompts={[prompt]}
        onOpen={vi.fn()}
        onRename={vi.fn()}
        onDuplicate={vi.fn()}
        onDelete={vi.fn()}
        {...props}
      />
    </MemoryRouter>,
  )
}

describe('SavedPromptList', () => {
  it('shows a designed empty state with a browse link', () => {
    renderList({ prompts: [] })
    expect(screen.getByText('No saved prompts yet')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Browse templates' }),
    ).toBeInTheDocument()
  })

  it('asks for confirmation before deleting', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderList({ onDelete })
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    // First click only asks; nothing is deleted yet.
    expect(onDelete).not.toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: 'Confirm delete' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }))
    expect(onDelete).toHaveBeenCalledWith('p1')
  })

  it('renames, duplicates, and opens', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    const onDuplicate = vi.fn()
    const onOpen = vi.fn()
    renderList({ onRename, onDuplicate, onOpen })
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(onOpen).toHaveBeenCalledWith(prompt)
    await user.click(screen.getByRole('button', { name: 'Duplicate' }))
    expect(onDuplicate).toHaveBeenCalledWith('p1')
    await user.click(screen.getByRole('button', { name: 'Rename' }))
    await user.clear(screen.getByLabelText('Prompt name'))
    await user.type(screen.getByLabelText('Prompt name'), 'New name')
    await user.click(screen.getByRole('button', { name: 'Save name' }))
    expect(onRename).toHaveBeenCalledWith('p1', 'New name')
  })
})
