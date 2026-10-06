import type { Template } from '../../../types'

export const vivaInterviewPractice: Template = {
  id: 'viva-interview-practice',
  audiences: ['college'],
  title: 'Viva / Interview Practice',
  description:
    'A strict examiner that asks one question at a time, digs deeper with follow-ups, scores every answer, and ends with honest feedback.',
  icon: '🎤',
  category: 'Career',
  questions: [
    {
      id: 'practiceKind',
      label: 'What are you preparing for?',
      helpText: 'Pick one, e.g. "Viva exam".',
      type: 'select',
      options: [
        { value: 'viva', label: 'Viva exam' },
        { value: 'job-interview', label: 'Job interview' },
        { value: 'internship-interview', label: 'Internship interview' },
      ],
      required: true,
    },
    {
      id: 'course',
      label: 'Which course, subject, or field is this for?',
      helpText: 'One line, e.g. "Operating Systems".',
      placeholder: 'e.g. Operating Systems',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'focusTopic',
      label: 'Which topic or role should I grill you on?',
      helpText:
        'Be specific, e.g. "process scheduling" or "frontend developer role".',
      placeholder: 'e.g. process scheduling',
      type: 'text',
      required: true,
      maxLength: 160,
    },
    {
      id: 'level',
      label: 'What is your level?',
      helpText: 'So the questions match you, e.g. Intermediate.',
      type: 'select',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ],
      required: true,
    },
    {
      id: 'roundSize',
      label: 'How many main questions should the round have?',
      helpText: 'Pick a size, e.g. "5 questions" for a quick drill.',
      type: 'select',
      options: [
        { value: '5-questions', label: '5 questions' },
        { value: '10-questions', label: '10 questions' },
        { value: '15-questions', label: '15 questions' },
      ],
      required: true,
    },
    {
      id: 'tone',
      label: 'How should the examiner talk to you?',
      helpText: 'Pick a style, e.g. Strict coach.',
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
      label: 'Paste your syllabus or job description (optional)',
      helpText:
        'Paste the key lines, e.g. 2-3 syllabus topics or must-have job skills.',
      placeholder: 'e.g. CPU scheduling algorithms, deadlocks, memory paging…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a sharp but fair examiner running a {{practiceKind}} for an {{level}} college student in {{course}}. The focus of this round is {{focusTopic}}.',
  goal: 'Run a mock {{practiceKind}} of {{roundSize}} on {{focusTopic}} in {{course}} that pressures the student like the real thing, probes every answer with follow-ups, and ends with scored, actionable feedback.',
  rules: [
    'Ask exactly one main question at a time and wait for the student’s answer before continuing.',
    'After each answer, ask at least one follow-up question based on what the student just said before moving to a new topic.',
    'Never reveal the ideal answer before the student has tried; give the model answer only after their attempt, in 3 lines or fewer.',
    'Score every answer out of 10 and show the running total, e.g. "Q3: 7/10. Total: 21/30 so far."',
    'When the round ends, report the total score, exactly 2 strengths, exactly 2 gaps, and what to prepare for each gap.',
  ],
  outputFormat:
    'During the round, repeat this shape:\n1. Question number and the question (one question only)\n2. Wait for the answer\n3. At least one follow-up question based on the answer\n4. Model answer in 3 lines or fewer, then the score, e.g. "Q3: 7/10. Total: 21/30 so far."\nAt the end, give: total score, 2 strengths, 2 gaps, and what to prepare for each gap',
  firstMessage:
    'Hello, and welcome to your mock {{practiceKind}} on {{focusTopic}} — {{roundSize}}, one question at a time with follow-ups, scored throughout. [In this same opening message, right after this greeting, ask question 1 and wait for my answer.]',
  sampleQuestions: [
    'Start the round now.',
    'That was too easy — ask harder follow-ups.',
    'What is my score so far, and where am I losing marks?',
    'End the round and give my final feedback.',
  ],
  improveTips: [
    'Paste the real syllabus or job description into the notes for realistic questions.',
    'Ask for "rapid-fire definitions" when you want speed practice.',
    'After the feedback, ask for a retest on your 2 gaps only.',
  ],
}
