import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { BuilderPage } from './BuilderPage'
import { ResultPage } from './ResultPage'
import { encodeShareData } from '../lib/share'
import type { Answers } from '../types'

const answers: Answers = {
  subject: 'maths',
  topic: 'fractions addition',
  grade: 'class-8',
  helpKind: 'explain-steps',
  tone: 'friendly',
}

function renderResult({
  path = '/result',
  state = null,
}: {
  path?: string
  state?: unknown
}) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: path.split('#')[0], hash: path.includes('#') ? `#${path.split('#')[1]}` : '', state } as never]}>
      <Routes>
        <Route path="/result" element={<ResultPage />} />
        <Route path="/templates" element={<div>Templates page</div>} />
        <Route path="/build/:templateId" element={<BuilderPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ResultPage', () => {
  it('shows a friendly empty state with a browse link when there is no data', () => {
    renderResult({})
    expect(
      screen.getByRole('heading', { name: 'No prompt yet' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Browse templates' }),
    ).toHaveAttribute('href', '/templates')
  })

  it('shows a friendly error for a broken share hash', () => {
    renderResult({ path: '/result#data=not-valid-base64!!!' })
    expect(
      screen.getByRole('heading', { name: 'This link did not work' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Browse templates' }),
    ).toBeInTheDocument()
  })

  it('shows a friendly error when answers fail validation', () => {
    const bad = encodeShareData({
      templateId: 'homework-helper',
      audience: 'school',
      answers: { subject: 'maths' },
    })
    renderResult({ path: `/result#data=${bad}` })
    expect(
      screen.getByRole('heading', { name: 'This link did not work' }),
    ).toBeInTheDocument()
  })

  it('renders the prompt, AI note, and actions for valid state', async () => {
    const user = userEvent.setup()
    renderResult({
      state: { templateId: 'homework-helper', audience: 'school', answers },
    })
    expect(
      screen.getByRole('heading', { name: /homework helper/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('AI chatbots can make mistakes. Check important facts.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Copy prompt' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit answers' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Save this prompt')).toBeInTheDocument()

    // Saving with a name confirms without crashing.
    await user.type(screen.getByPlaceholderText(/my version/i), 'My maths bot')
    await user.click(screen.getByRole('button', { name: 'Save prompt' }))
    expect(screen.getByText(/saved .*my maths bot/i)).toBeInTheDocument()
  })

  it('warns instead of breaking when the share link is very long', () => {
    renderResult({
      state: {
        templateId: 'homework-helper',
        audience: 'school',
        answers: { ...answers, notes: 'n'.repeat(1800) },
      },
    })
    expect(screen.getByText(/very long/i)).toBeInTheDocument()
    expect(
      screen.getByText(/copy prompt button is easier/i),
    ).toBeInTheDocument()
  })

  it('edit answers returns to the builder pre-filled', async () => {
    const user = userEvent.setup()
    renderResult({
      state: { templateId: 'homework-helper', audience: 'school', answers },
    })
    await user.click(screen.getByRole('button', { name: 'Edit answers' }))
    // The builder restarts at the first question, with saved answers kept.
    expect(
      await screen.findByLabelText(/which subject is the homework for/i),
    ).toHaveValue('maths')
  })
})
