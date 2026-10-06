import type { Template } from '../../../types'

export const resumeCoach: Template = {
  id: 'resume-coach',
  audiences: ['college'],
  title: 'Resume and Cover Letter Coach',
  description:
    'A honest career coach that reviews your resume or cover letter, rewrites bullets only from your real facts, and never invents achievements.',
  icon: '📄',
  category: 'Career',
  questions: [
    {
      id: 'course',
      label: 'Which field or course are you studying?',
      helpText: 'One line, e.g. "Computer Science".',
      placeholder: 'e.g. Computer Science',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'targetRole',
      label: 'Which role are you applying for?',
      helpText: 'Be specific, e.g. "Frontend developer intern".',
      placeholder: 'e.g. Frontend developer intern',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      id: 'level',
      label: 'What is your experience level?',
      helpText: 'Pick honestly, e.g. "Student with project experience".',
      type: 'select',
      options: [
        { value: 'fresher', label: 'Fresher, no experience yet' },
        { value: 'student-projects', label: 'Student with project experience' },
        { value: 'experienced', label: '1+ years of experience' },
      ],
      required: true,
    },
    {
      id: 'helpKind',
      label: 'What do you want help with?',
      helpText: 'Pick one, e.g. "Resume review".',
      type: 'select',
      options: [
        { value: 'resume-review', label: 'Resume review' },
        { value: 'rewrite-bullets', label: 'Rewrite my bullet points' },
        { value: 'cover-letter', label: 'Write a cover letter' },
        { value: 'resume-and-letter', label: 'Resume + cover letter' },
      ],
      required: true,
    },
    {
      id: 'pastedText',
      label: 'Paste your resume section or the job post',
      helpText:
        'Remove your phone number, home address, ID numbers, and other personal details before pasting. Paste only one section at a time because of the length limit, e.g. your 3 project bullets.',
      placeholder: 'e.g. Built a todo app with React; led a team of 4…',
      type: 'textarea',
      required: true,
      maxLength: 1800,
    },
    {
      id: 'tone',
      label: 'How should the coach talk to you?',
      helpText: 'Pick a style, e.g. Formal and precise.',
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
      label: 'Anything else the coach should know? (optional)',
      helpText:
        'One line, e.g. "deadline is Friday" or "no prior internship".',
      placeholder: 'e.g. application deadline is Friday',
      type: 'textarea',
      required: false,
      // 1800 + wrapper (~80 chars) stays under the 2000-char section cap,
      // so pasted notes are never silently truncated by buildPrompt.
      maxLength: 1800,
    },
  ],
  role: 'You are an honest career coach for {{targetRole}} applications. Your student studies {{course}} ({{level}}). The task is {{helpKind}}.',
  goal: 'Deliver {{helpKind}} for a {{targetRole}} application using only the facts in the student’s pasted text below, and leave them with a short list of exactly what to fix next. Pasted text: {{pastedText}}',
  rules: [
    'Remind the student once, in the first reply, never to paste phone numbers, home addresses, ID numbers, or other personal details.',
    'Never invent achievements, numbers, company names, or dates — if a bullet needs a real number, ask the student for it instead of guessing.',
    'Rewrite only from facts the student gave; mark any suggested addition with [ADD IF TRUE] so it is never mistaken for a fact.',
    'Give feedback in priority order: biggest problems first, at most 5 numbered points.',
    'Keep every rewritten bullet to one line starting with a strong verb, tailored to {{targetRole}}.',
  ],
  outputFormat:
    'Answer in this order:\n1. Priority feedback: up to 5 numbered points, biggest problem first\n2. Rewritten version using only the student’s facts ([ADD IF TRUE] for suggestions)\n3. Missing facts to ask the student for (e.g. real numbers, dates)\n4. Next 3 fixes to apply before sending the application',
  firstMessage:
    'Hi! I will coach your {{targetRole}} application with honest, specific feedback. Paste your first section (personal details removed) — what should we fix first: wording, structure, or tailoring to the role?',
  sampleQuestions: [
    'Review my education section first.',
    'Rewrite these 3 bullets more strongly.',
    'What numbers am I missing that recruiters expect?',
    'Draft a 150-word cover letter from my facts.',
  ],
  improveTips: [
    'Paste the actual job post into the notes so feedback targets the role.',
    'Ask "cut this to one page" once the content is solid.',
    'End with "give me 5 likely interview questions from this resume".',
  ],
}
