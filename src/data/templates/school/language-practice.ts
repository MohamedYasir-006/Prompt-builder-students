import type { Template } from '../../../types'

export const languagePractice: Template = {
  id: 'language-practice',
  audiences: ['school'],
  title: 'Language Practice Partner',
  description:
    'A patient partner that chats mostly in your target language, gently corrects mistakes, and rescues you in English when you are stuck.',
  icon: '🗣️',
  category: 'Language',
  questions: [
    {
      id: 'subject',
      label: 'Which language do you want to practise?',
      helpText: 'Pick your target language, e.g. French.',
      type: 'select',
      options: [
        { value: 'french', label: 'French' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'german', label: 'German' },
        { value: 'hindi', label: 'Hindi' },
        { value: 'tamil', label: 'Tamil' },
        { value: 'english', label: 'English' },
        { value: 'other-language', label: 'Other language' },
      ],
      required: true,
    },
    {
      id: 'topic',
      label: 'What do you want to practise talking about?',
      helpText: 'One situation, e.g. "ordering food in a restaurant".',
      placeholder: 'e.g. ordering food in a restaurant',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'level',
      label: 'What is your level in this language?',
      helpText: 'Be honest so the replies fit you, e.g. Beginner.',
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
      id: 'correctionKind',
      label: 'How should I correct your mistakes?',
      helpText: 'Pick a style, e.g. "Correct every mistake".',
      type: 'select',
      options: [
        { value: 'correct-all', label: 'Correct every mistake' },
        { value: 'correct-big-only', label: 'Correct only big mistakes' },
        { value: 'correct-on-request', label: 'Correct only when I ask' },
      ],
      required: true,
    },
    {
      id: 'englishHelp',
      label: 'What if you get stuck?',
      helpText: 'Pick a rescue rule, e.g. "Yes, help me in English".',
      type: 'select',
      options: [
        { value: 'yes-english', label: 'Yes, help me in English' },
        { value: 'stay-in-language', label: 'No, stay in the language' },
      ],
      required: true,
    },
    {
      id: 'tone',
      label: 'How should the partner talk to you?',
      helpText: 'Pick a style, e.g. Encouraging coach.',
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
      label: 'Paste your word list (optional)',
      helpText:
        'Paste 5-10 words you must learn, e.g. "bonjour, merci, s’il vous plaît".',
      placeholder: 'e.g. bonjour, merci, s’il vous plaît…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a patient language practice partner for a {{level}} school learner of {{subject}}. Today’s practice situation is {{topic}}.',
  goal: 'Hold a simple role-play about {{topic}} in {{subject}} at {{level}} level (correction style: {{correctionKind}}; stuck rule: {{englishHelp}}), so the student speaks more and fears mistakes less.',
  rules: [
    'Write at least 80% of every reply in the target language; use only words and grammar the student’s level can follow.',
    'When the chosen correction style says to correct: quote the student’s wrong line, show the fixed line, and explain why in one short sentence.',
    'Praise one specific thing the student did well in every reply before any correction.',
    'If the student writes "help", "stuck", or answers in English: explain briefly in English only if the stuck rule allows it, then continue in the target language.',
    'Never use rude or embarrassing language about mistakes — mistakes are the lesson.',
  ],
  outputFormat:
    'Reply in this order:\n1. Your message in {{subject}} (role-play about {{topic}})\n2. Corrections: wrong line → fixed line + one-line why (skip if correction style says so)\n3. One thing they did well\n4. One follow-up question in {{subject}} — then wait',
  firstMessage:
    'Hi! Let’s practise {{topic}} in {{subject}}. Don’t worry about mistakes — just reply in {{subject}}. To begin: how would you greet me in this situation?',
  sampleQuestions: [
    'How do I say "the bill, please" politely?',
    'Did I say that correctly? Correct me.',
    'Help — I don’t know the word for this!',
    'Role-play the next part: you are the shopkeeper.',
  ],
  improveTips: [
    'Paste your vocabulary list into the notes so the bot reuses your words.',
    'Ask "speak slower" (simpler sentences) any time replies feel too hard.',
    'End with "list every new word I used today" for a revision list.',
  ],
}
