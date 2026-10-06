import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { BuilderPage } from './BuilderPage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/build/:templateId" element={<BuilderPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  window.sessionStorage.clear()
})

describe('BuilderPage', () => {
  it('shows one question at a time with a progress bar', () => {
    renderAt('/build/homework-helper')
    expect(screen.getByText('Question 1 of 6')).toBeInTheDocument()
    expect(
      screen.getByLabelText(/which subject is the homework for/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/what is the homework about/i),
    ).not.toBeInTheDocument()
  })

  it('blocks Next with a clear message until a required question is answered', async () => {
    const user = userEvent.setup()
    renderAt('/build/homework-helper')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      screen.getByRole('alert'),
    ).toHaveTextContent('Please choose an option to continue.')
    expect(screen.getByText('Question 1 of 6')).toBeInTheDocument()
  })

  it('walks the whole flow and shows a live character counter on notes', async () => {
    const user = userEvent.setup()
    renderAt('/build/homework-helper')

    await user.selectOptions(
      screen.getByLabelText(/which subject is the homework for/i),
      'maths',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))

    await user.type(
      screen.getByLabelText(/what is the homework about/i),
      'fractions',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))

    await user.selectOptions(
      screen.getByLabelText(/which class are you in/i),
      'class-8',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))

    await user.selectOptions(
      screen.getByLabelText(/what kind of help/i),
      'explain-steps',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))

    await user.selectOptions(
      screen.getByLabelText(/how should the tutor talk/i),
      'friendly',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Question 6 of 6')).toBeInTheDocument()
    const notes = screen.getByLabelText(/paste your class notes/i)
    expect(screen.getByText('0/1800 characters')).toBeInTheDocument()
    await user.type(notes, 'abc')
    expect(screen.getByText('3/1800 characters')).toBeInTheDocument()
  })

  it('shows a friendly message for an unknown template id', () => {
    renderAt('/build/no-such-template')
    expect(
      screen.getByRole('heading', { name: 'Template not found' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Browse templates' }),
    ).toHaveAttribute('href', '/templates')
  })

  it('restores draft answers from sessionStorage on reload', async () => {
    const user = userEvent.setup()
    const first = renderAt('/build/homework-helper')
    await user.selectOptions(
      screen.getByLabelText(/which subject is the homework for/i),
      'maths',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByLabelText(/what is the homework about/i),
    ).toBeInTheDocument()
    first.unmount()

    // A reload mounts the builder again: the draft keeps the first answer.
    renderAt('/build/homework-helper')
    expect(
      screen.getByLabelText(/which subject is the homework for/i),
    ).toHaveValue('maths')
  })

  it('moves focus to the new question when Next is pressed', async () => {
    const user = userEvent.setup()
    renderAt('/build/homework-helper')
    await user.selectOptions(
      screen.getByLabelText(/which subject is the homework for/i),
      'maths',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByLabelText(/what is the homework about/i),
    ).toHaveFocus()
  })
})
