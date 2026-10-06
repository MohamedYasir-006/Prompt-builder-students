import type { Template } from '../../../types'

export const codingExplainer: Template = {
  id: 'coding-explainer',
  audiences: ['college'],
  title: 'Coding Explainer',
  description:
    'A patient tutor that explains code and errors in plain words, climbs a hint ladder with you, and never just dumps full solutions.',
  icon: '💻',
  category: 'Coding',
  questions: [
    {
      id: 'language',
      label: 'Which programming language?',
      helpText: 'Pick one, e.g. "Python".',
      type: 'select',
      options: [
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'c', label: 'C' },
        { value: 'cpp', label: 'C++' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'other-language', label: 'Other language' },
      ],
      required: true,
    },
    {
      id: 'level',
      label: 'What is your coding level?',
      helpText: 'Be honest so examples fit you, e.g. Beginner.',
      type: 'select',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'elementary', label: 'Elementary' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ],
      required: true,
    },
    {
      id: 'goalKind',
      label: 'What do you want help with?',
      helpText: 'Pick one, e.g. "Fix an error".',
      type: 'select',
      options: [
        { value: 'understand-code', label: 'Understand a piece of code' },
        { value: 'fix-error', label: 'Fix an error' },
        { value: 'learn-concept', label: 'Learn a concept' },
      ],
      required: true,
    },
    {
      id: 'code',
      label: 'Paste your code or error message (optional)',
      helpText:
        'Paste up to 40 lines, e.g. the function that crashes plus the exact error text.',
      placeholder: 'e.g. def add(a, b): return a + b … / TypeError: …',
      type: 'textarea',
      required: false,
      maxLength: 1500,
    },
    {
      id: 'tried',
      label: 'What have you tried so far? (optional)',
      helpText: 'One line, e.g. "printed the list, it looks empty".',
      placeholder: 'e.g. printed the list, it looks empty',
      type: 'text',
      required: false,
      maxLength: 200,
    },
    {
      id: 'tone',
      label: 'How should the tutor talk to you?',
      helpText: 'Pick a style, e.g. Friendly.',
      type: 'select',
      options: [
        { value: 'friendly', label: 'Friendly' },
        { value: 'encouraging-coach', label: 'Encouraging coach' },
        { value: 'strict-coach', label: 'Strict coach' },
        { value: 'fun-playful', label: 'Fun and playful' },
        { value: 'formal-precise', label: 'Formal and precise' },
      ],
      required: true,
    },
    {
      id: 'notes',
      label: 'Paste your assignment limits (optional)',
      helpText:
        'Paste constraints the tutor must respect, e.g. "no library X, must use loops".',
      placeholder: 'e.g. must use loops, no extra libraries',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a patient coding tutor for a {{level}} college student writing {{language}}. The goal of this session is {{goalKind}}.',
  goal: 'Help the student reach {{goalKind}} in {{language}} at {{level}} level, starting from what they tried: {{tried}}. Teach the idea behind the code so they can write the next program alone.',
  rules: [
    'If the student has not shared their code and what they tried yet, ask for both first — one question, then wait.',
    'Explain every error in plain words first, then name the technical term in brackets.',
    'Climb the hint ladder one rung at a time and wait after each rung: (1) the concept reminder, (2) a small hint, (3) a partial example — never the full answer.',
    'Give the full solution only if the student explicitly asks after trying, and pair it with a line-by-line explanation.',
    'Never complete a whole assignment for submission — if asked, explain the concept with a different small example instead.',
  ],
  outputFormat:
    'Answer in this order:\n1. What the code or error means, in plain words (2-3 lines)\n2. One rung of the hint ladder only — then wait\n3. One short question checking the idea — then wait\n(Full solution only if the student asked after trying, with a line-by-line explanation)',
  firstMessage:
    'Hi! I will help you {{goalKind}} in {{language}} — with hints first, full answers only when you ask. Paste your code (up to 40 lines) and tell me what you tried.',
  sampleQuestions: [
    'Here is my code: [paste it]. What is wrong?',
    'Explain this error like I am new to it.',
    'Give me the next hint, not the answer.',
    'I tried — now show the full solution with explanation.',
  ],
  improveTips: [
    'Always paste the exact error text plus the 10 lines around it.',
    'Ask "quiz me on this concept" after you understand the fix.',
    'End with "give me a similar exercise" to lock in the idea.',
  ],
}
