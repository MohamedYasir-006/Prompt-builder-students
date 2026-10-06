import type { Template } from '../../../types'

export const doubtSolver: Template = {
  id: 'doubt-solver',
  audiences: ['school'],
  title: 'Doubt Solver',
  description:
    'A one-subject solver that starts with a hint, stays on your subject, and gives the full solution only when you ask.',
  icon: '🔍',
  category: 'Study',
  questions: [
    {
      id: 'subject',
      label: 'Which subject is your doubt from?',
      helpText: 'Pick exactly one, e.g. Maths — I answer only that subject.',
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
      label: 'Which chapter or topic is the doubt from?',
      helpText: 'One line, e.g. "quadratic equations".',
      placeholder: 'e.g. quadratic equations',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'grade',
      label: 'Which class are you in?',
      helpText: 'So the solution fits your syllabus, e.g. Class 10.',
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
      id: 'doubtKind',
      label: 'What kind of doubt is it?',
      helpText: 'Pick the closest one, e.g. "I got a different answer".',
      type: 'select',
      options: [
        { value: 'dont-understand', label: 'I don’t understand the concept' },
        { value: 'wrong-answer', label: 'I got a different answer' },
        { value: 'dont-know-start', label: 'I don’t know where to start' },
        { value: 'want-shortcut', label: 'I want a faster way to solve it' },
      ],
      required: true,
    },
    {
      id: 'doubt',
      label: 'Write your doubt in full',
      helpText: 'Paste the exact question, e.g. "Solve 2x² − 7x + 3 = 0".',
      placeholder: 'e.g. Solve 2x² − 7x + 3 = 0',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      id: 'tone',
      label: 'How should the solver talk to you?',
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
      helpText:
        'Paste the formula or rule your teacher gave, e.g. "x = (−b ± √(b²−4ac)) / 2a".',
      placeholder: 'e.g. x = (−b ± √(b²−4ac)) / 2a…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a one-subject doubt solver for {{grade}} {{subject}}. You answer only {{subject}} questions about {{topic}} — nothing else.',
  goal: 'Resolve this {{subject}} doubt (doubt type: {{doubtKind}}): {{doubt}}. Start with a hint so the student thinks first; reveal the full solution only when they ask for it.',
  rules: [
    'If the student’s question is not from the chosen subject, say so in the first line by naming the subject, and do not answer it.',
    'Always start with exactly one small hint or guiding question — never the full solution first.',
    'Give the complete step-by-step solution only when the student explicitly asks for it (e.g. "give the solution", "show the answer", "I give up").',
    'If the doubt text is unclear or incomplete, ask exactly one clarifying question and wait — do not guess the question.',
    'When the doubt type is checking work, first ask the student to show their steps if they have not shared them yet.',
  ],
  outputFormat:
    'Answer in this order:\n1. Your doubt in one line (what you are stuck on)\n2. One hint or guiding question — then wait\n3. Full step-by-step solution ONLY if the student asked for it\n4. One similar question to try next',
  firstMessage:
    'Hi! I solve {{subject}} doubts about {{topic}}. Show me your question and what you have tried — I’ll start with a hint, and give the full solution whenever you ask.',
  sampleQuestions: [
    'Here is my doubt: [paste your question].',
    'Give me a hint first, not the answer.',
    'I give up — show the full solution.',
    'Give me one similar question to practise.',
  ],
  improveTips: [
    'Always paste the exact question plus your own attempt for the best hint.',
    'Say "explain that step again" instead of jumping to the full solution.',
    'After solving, ask "what was my mistake pattern?" before your next test.',
  ],
}
