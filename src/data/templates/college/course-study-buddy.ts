import type { Template } from '../../../types'

export const courseStudyBuddy: Template = {
  id: 'course-study-buddy',
  audiences: ['college'],
  title: 'Course Study Buddy',
  description: 'A study partner that explains concepts, quizzes you, and preps you for exams.',
  icon: '🎓',
  category: 'Study',
  questions: [
    {
      id: 'course',
      label: 'Which course or subject is this for?',
      helpText: 'One line, e.g. "Data Structures".',
      placeholder: 'e.g. Data Structures',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'focusTopic',
      label: 'Which topic or exam are you preparing for?',
      helpText: 'Be specific, e.g. "Binary trees for next week\'s midterm".',
      placeholder: 'e.g. Binary trees for next week’s midterm',
      type: 'text',
      required: true,
      maxLength: 160,
    },
    {
      id: 'year',
      label: 'Which year are you in?',
      helpText: 'So the buddy uses the right depth, e.g. 2nd year.',
      type: 'select',
      options: [
        { value: '1st-year', label: '1st year' },
        { value: '2nd-year', label: '2nd year' },
        { value: '3rd-year', label: '3rd year' },
        { value: '4th-year', label: '4th year' },
        { value: 'postgraduate', label: 'Postgraduate' },
      ],
      required: true,
    },
    {
      id: 'studyMode',
      label: 'How do you want to study?',
      helpText: 'Pick one, e.g. "Practice questions".',
      type: 'select',
      options: [
        { value: 'revise-concepts', label: 'Revise concepts' },
        { value: 'practice-questions', label: 'Practice questions' },
        { value: 'exam-prep', label: 'Prepare for an exam' },
        { value: 'clear-doubts', label: 'Clear my doubts' },
      ],
      required: true,
    },
    {
      id: 'tone',
      label: 'How should the buddy talk to you?',
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
      label: 'Paste your lecture notes (optional)',
      helpText: 'Paste key points, e.g. definitions from your last lecture.',
      placeholder: 'e.g. A binary tree has at most two children per node…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a sharp course study buddy for a {{year}} college student taking {{course}}. The current focus is {{focusTopic}}.',
  goal: 'Help the student master {{focusTopic}} in {{course}} (study mode: {{studyMode}}) through clear explanations and active recall, so they are ready for exams and viva questions.',
  rules: [
    'Teach the idea first, then test with one question before moving on.',
    'When the student makes a mistake, explain the concept behind it instead of just giving the correct answer.',
    'Relate theory to one real-world or interview-style example per topic.',
  ],
  outputFormat:
    'Answer in this order:\n1. Key idea in 2-3 lines\n2. A small example\n3. One question to test the student\n4. What to revise next',
  firstMessage:
    "Hi! I am your study buddy for {{course}} — let's crack {{focusTopic}}. Tell me where you stand: revising from scratch or testing yourself?",
  sampleQuestions: [
    'Explain this topic like I missed the lecture.',
    'Quiz me with 5 questions, one at a time.',
    'What are the most likely exam questions here?',
    'Give me a viva-style follow-up question.',
  ],
  improveTips: [
    'Paste your syllabus weightage into the notes before exams.',
    'Ask for "previous-year style questions" for realistic practice.',
    'End each session with "summarise what I learned today".',
  ],
}
