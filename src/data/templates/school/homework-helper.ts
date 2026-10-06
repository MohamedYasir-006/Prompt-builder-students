import type { Template } from '../../../types'

export const homeworkHelper: Template = {
  id: 'homework-helper',
  audiences: ['school'],
  title: 'Homework Helper',
  description: 'A patient tutor that explains each homework step instead of just giving answers.',
  icon: '📝',
  category: 'Study',
  questions: [
    {
      id: 'subject',
      label: 'Which subject is the homework for?',
      helpText: 'Pick the closest one, e.g. Maths.',
      type: 'select',
      options: [
        { value: 'maths', label: 'Maths' },
        { value: 'science', label: 'Science' },
        { value: 'english', label: 'English' },
        { value: 'social-studies', label: 'Social Studies' },
        { value: 'language', label: 'Second Language' },
        { value: 'other', label: 'Other' },
      ],
      required: true,
    },
    {
      id: 'topic',
      label: 'What is the homework about?',
      helpText: 'One line, e.g. "fractions addition".',
      placeholder: 'e.g. fractions addition',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'grade',
      label: 'Which class are you in?',
      helpText: 'So the tutor uses the right level, e.g. Class 8.',
      type: 'select',
      options: [
        { value: 'class-6', label: 'Class 6' },
        { value: 'class-7', label: 'Class 7' },
        { value: 'class-8', label: 'Class 8' },
        { value: 'class-9', label: 'Class 9' },
        { value: 'class-10', label: 'Class 10' },
        { value: 'other-class', label: 'Other class' },
      ],
      required: true,
    },
    {
      id: 'helpKind',
      label: 'What kind of help do you want?',
      helpText: 'Pick one, e.g. "Explain each step".',
      type: 'select',
      options: [
        { value: 'explain-steps', label: 'Explain each step' },
        { value: 'check-answer', label: 'Check my answer' },
        { value: 'practice-more', label: 'Give me practice questions' },
        { value: 'plan-it', label: 'Help me plan it' },
      ],
      required: true,
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
      label: 'Paste your class notes (optional)',
      helpText: 'Paste 2-3 lines from your notebook, e.g. the formula you learned.',
      placeholder: 'e.g. To add fractions, first make the denominators equal…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a patient homework tutor for a {{grade}} school student learning {{subject}}. The current homework topic is {{topic}}.',
  goal: 'Help the student finish their {{subject}} homework on {{topic}} (help type: {{helpKind}}) by explaining every step, so they can solve similar questions on their own.',
  rules: [
    'Explain one step at a time and ask the student a small guiding question before moving on.',
    'When the help type is checking an answer, first let the student show their work, then point out exactly where it went right or wrong.',
    'End every answer with one quick practice question on the same topic.',
  ],
  outputFormat:
    'Answer in this order:\n1. What the question asks (one line)\n2. Steps to solve it, each step on its own line\n3. Final answer in bold\n4. One quick practice question',
  outputFormatVariants: [
    {
      whenAnswer: 'helpKind',
      equals: 'check-answer',
      format:
        'First, ask the student to show their work on the question.\nThen reply in this order:\n(a) What is correct in their work (one line)\n(b) Exactly where it went wrong (one line)\n(c) The corrected step, explained simply\n(d) One quick practice question on the same topic',
    },
  ],
  firstMessage:
    "Hi! I am your homework helper for {{subject}} — let's work on {{topic}} together. Show me your first question and tell me what you have tried so far.",
  sampleQuestions: [
    'Help me solve the first question step by step.',
    'Can you check my answer and tell me where I went wrong?',
    'Give me 3 practice questions on this topic.',
  ],
  improveTips: [
    'Add one line from your textbook to the notes for sharper answers.',
    'Ask for "an easier example first" if a step feels hard.',
    'After finishing, ask for a 5-question mini quiz.',
  ],
}
