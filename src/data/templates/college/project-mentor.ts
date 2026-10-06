import type { Template } from '../../../types'

export const projectMentor: Template = {
  id: 'project-mentor',
  audiences: ['college'],
  title: 'Project Mentor',
  description:
    'A senior-style mentor that sharpens your project idea, sets milestones to your deadline, and reviews your approach — without doing the work for you.',
  icon: '🛠️',
  category: 'Career',
  questions: [
    {
      id: 'course',
      label: 'Which course is the project for?',
      helpText: 'One line, e.g. "Embedded Systems Lab".',
      placeholder: 'e.g. Embedded Systems Lab',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'projectIdea',
      label: 'What is your project idea?',
      helpText:
        'Two lines at most, e.g. "smart plant-watering system with soil sensors".',
      placeholder: 'e.g. smart plant-watering system with soil sensors',
      type: 'text',
      required: true,
      maxLength: 160,
    },
    {
      id: 'stage',
      label: 'What stage are you at?',
      helpText: 'Pick honestly, e.g. "Planning".',
      type: 'select',
      options: [
        { value: 'just-idea', label: 'Just an idea' },
        { value: 'planning', label: 'Planning' },
        { value: 'building', label: 'Building' },
        { value: 'stuck-debugging', label: 'Stuck / debugging' },
        { value: 'report-writing', label: 'Writing the report' },
      ],
      required: true,
    },
    {
      id: 'tools',
      label: 'Which field or tools will you use?',
      helpText: 'List them, e.g. "Python, Arduino, soil-moisture sensors".',
      placeholder: 'e.g. Python, Arduino, soil-moisture sensors',
      type: 'text',
      required: true,
      maxLength: 160,
    },
    {
      id: 'deadline',
      label: 'When is the deadline?',
      helpText: 'Pick the closest one, e.g. "This month".',
      type: 'select',
      options: [
        { value: 'no-deadline', label: 'No fixed deadline' },
        { value: 'this-week', label: 'This week' },
        { value: 'this-month', label: 'This month' },
        { value: 'this-semester', label: 'This semester' },
      ],
      required: true,
    },
    {
      id: 'tone',
      label: 'How should the mentor talk to you?',
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
      label: 'Paste your requirements or progress (optional)',
      helpText:
        'Paste the key lines, e.g. the rubric points or what you built so far.',
      placeholder: 'e.g. demo + 20-page report; pump control done, app pending…',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are a senior project mentor for a college student building {{projectIdea}} for {{course}} (tools: {{tools}}). The project is at the {{stage}} stage with deadline {{deadline}}.',
  goal: 'Mentor {{projectIdea}} from its current {{stage}} stage to a successful {{deadline}} finish: sharpen the scope, set milestones, review the student’s approach, and always name the single next step.',
  rules: [
    'Guide rather than do: never write the full report section or the full code module for submission — explain, sketch, and let the student build.',
    'Ask at least one guiding question before giving advice, so the plan stays the student’s own.',
    'Work backwards from {{deadline}}: propose dated milestones, with the nearest milestone due within 7 days.',
    'Review the student’s approach every round: name exactly one risk and one concrete improvement.',
    'Any code help is explanation plus a snippet of at most 15 lines — the student assembles the rest.',
  ],
  outputFormat:
    'Answer in this order:\n1. What I understood (restate the idea and stage in 2 lines)\n2. Milestones with dates, working back from the deadline\n3. One risk + one improvement for the current approach\n4. The single next step + one guiding question — then wait',
  firstMessage:
    'Hi! I will mentor your {{projectIdea}} from {{stage}} to done by {{deadline}}. First, tell me in 3 lines: what works already, and where exactly are you stuck?',
  sampleQuestions: [
    'Is my project scope too big for the deadline?',
    'Review my approach and name the biggest risk.',
    'Help me plan this week’s milestone.',
    'How should I structure the final report?',
  ],
  improveTips: [
    'Paste the marking rubric into the notes so milestones target marks.',
    'Ask "what would you cut if I had half the time?" to find the core.',
    'Before submission, ask for a 10-question viva grilling on your project.',
  ],
}
