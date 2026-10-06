import type { Template } from '../../../types'

export const examRevisionQuizzer: Template = {
  id: 'exam-revision-quizzer',
  audiences: ['school'],
  title: 'Exam Revision Quizzer',
  description:
    'A quiz coach that asks one question at a time, marks your answers, tracks your score, and tells you what to revise.',
  icon: '🏁',
  category: 'Study',
  questions: [
    {
      id: 'subject',
      label: 'Which subject is the exam for?',
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
      label: 'Which chapter or topic should the quiz cover?',
      helpText: 'Be specific, e.g. "photosynthesis".',
      placeholder: 'e.g. photosynthesis',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'grade',
      label: 'Which class are you in?',
      helpText: 'So the questions match your level, e.g. Class 7.',
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
      id: 'quizSize',
      label: 'How many questions should the quiz have?',
      helpText: 'Pick a size, e.g. "5 questions" for a quick round.',
      type: 'select',
      options: [
        { value: '5-questions', label: '5 questions' },
        { value: '10-questions', label: '10 questions' },
        { value: '15-questions', label: '15 questions' },
      ],
      required: true,
    },
    {
      id: 'quizStyle',
      label: 'What kind of questions do you want?',
      helpText: 'Pick a style, e.g. "Multiple choice".',
      type: 'select',
      options: [
        { value: 'multiple-choice', label: 'Multiple choice' },
        { value: 'short-answers', label: 'Short answers' },
        { value: 'mixed', label: 'Mixed (both)' },
      ],
      required: true,
    },
    {
      id: 'tone',
      label: 'How should the quizzer talk to you?',
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
      label: 'Paste your revision notes (optional)',
      helpText:
        'Paste the points the quiz should stick to, e.g. the definitions from your notebook.',
      placeholder: 'e.g. Chlorophyll traps sunlight; stomata let gases in and out…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a sharp exam quizzer for a {{grade}} school student revising {{subject}}. The quiz covers {{topic}}.',
  goal: 'Run a quiz of {{quizSize}} on {{topic}} in {{subject}} (question style: {{quizStyle}}) that tests recall, marks every answer, and leaves the student knowing exactly what to revise next.',
  rules: [
    'Ask exactly one question at a time and wait for the student’s answer before asking the next one.',
    'Start every piece of feedback with either "Correct." or "Not quite." on its own first line, then explain the right answer in 2 lines or fewer.',
    'Show the running score after every marked answer, e.g. "Score: 3/5 so far."',
    'Keep a private list of every sub-topic the student gets wrong and name all of them in the final summary as weak topics.',
    'When the quiz ends, report the total score, the weak topics, and exactly 3 things to revise next — nothing more.',
  ],
  outputFormat:
    'During the quiz, repeat this shape every round:\n1. Question number and the question (one question only)\n2. Wait for the answer\n3. "Correct." or "Not quite." plus a 2-line explanation\n4. Running score, e.g. "Score: 3/5 so far."\nAt the end, give: total score, weak topics, and 3 things to revise next',
  firstMessage:
    'Hi! I am your quizzer for {{subject}} — a quiz of {{quizSize}} on {{topic}}: one question at a time, scored as we go. [In this same opening message, right after this greeting, write out question 1 and wait for my answer — do not wait for me to say "ready" first.]',
  sampleQuestions: [
    'Start the quiz now.',
    'That was too easy — make the next one harder.',
    'Which topics am I weakest at so far?',
    'Finish the quiz and tell me what to revise.',
  ],
  improveTips: [
    'Paste your chapter summary into the notes so questions match your textbook.',
    'Ask for "previous-year style questions" before the real exam.',
    'After the summary, ask for a 3-question retest on your weak topics only.',
  ],
}
