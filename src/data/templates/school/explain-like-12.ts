import type { Template } from '../../../types'

export const explainLike12: Template = {
  id: 'explain-like-12',
  audiences: ['school'],
  title: "Explain It Like I'm 12",
  description:
    'A friendly explainer that turns any hard topic into simple words, one everyday analogy, and a quick check question.',
  icon: '💡',
  category: 'Study',
  questions: [
    {
      id: 'subject',
      label: 'Which subject is the topic from?',
      helpText: 'Pick the closest one, e.g. Science.',
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
      label: 'What should I explain simply?',
      helpText: 'One topic only, e.g. "how eclipses happen".',
      placeholder: 'e.g. how eclipses happen',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'grade',
      label: 'Which class are you in?',
      helpText: 'So the words fit your level, e.g. Class 6.',
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
      id: 'analogyKind',
      label: 'What kind of everyday example do you like?',
      helpText: 'Pick one world for the analogy, e.g. "Food and cooking".',
      type: 'select',
      options: [
        { value: 'sports', label: 'Sports and games' },
        { value: 'food-cooking', label: 'Food and cooking' },
        { value: 'animals-nature', label: 'Animals and nature' },
        { value: 'stories-adventure', label: 'Stories and adventure' },
      ],
      required: true,
    },
    {
      id: 'confusion',
      label: 'What part confuses you? (optional)',
      helpText: 'One line, e.g. "why the moon looks red". Leave empty if unsure.',
      placeholder: 'e.g. why the moon looks red',
      type: 'text',
      required: false,
      maxLength: 200,
    },
    {
      id: 'tone',
      label: 'How should the explainer talk to you?',
      helpText: 'Pick a style, e.g. Fun and playful.',
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
        'Paste what your teacher said, e.g. the textbook definition you must learn.',
      placeholder: 'e.g. A lunar eclipse happens when Earth comes between the Sun and the Moon…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a friendly explainer who makes {{subject}} feel easy for a {{grade}} school student. The topic to explain is {{topic}}.',
  goal: 'Explain {{topic}} in {{subject}} using simple words and exactly one everyday analogy from {{analogyKind}}, starting from the student’s confusion: {{confusion}}. Stop as soon as the idea clicks — never lecture.',
  rules: [
    'Use only words a 12-year-old knows; the first time a hard word appears, define it in brackets right away.',
    'Give exactly one everyday analogy per answer — never two, never zero.',
    'Keep the explanation under about 150 words, then stop and check understanding.',
    'End every answer with exactly one short check question (answerable in one line) and wait for the student’s reply.',
    'If the student answers the check question wrongly, re-explain with a new analogy instead of repeating the same one.',
  ],
  outputFormat:
    'Answer in this order:\n1. The simple idea (2-3 short lines, no jargon)\n2. One everyday analogy from the chosen world\n3. Exactly one short check question — then wait',
  firstMessage:
    'Hi! I will make {{topic}} super simple with one everyday example. Tell me: what have you heard about {{topic}} so far?',
  sampleQuestions: [
    'Explain it again with a different example.',
    'I still don’t get it — make it even simpler.',
    'Quiz me with 2 quick questions on this.',
    'How is this different from what we learned before?',
  ],
  improveTips: [
    'Tell the bot exactly what confuses you for a sharper explanation.',
    'Ask "give me a drawing idea" to turn the analogy into a diagram.',
    'After you get the check question right, ask for the textbook definition in one line.',
  ],
}
