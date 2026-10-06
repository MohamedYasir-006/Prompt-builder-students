import type { Audience, Template } from '../../types'
import { codingExplainer } from './college/coding-explainer'
import { courseStudyBuddy } from './college/course-study-buddy'
import { projectMentor } from './college/project-mentor'
import { resumeCoach } from './college/resume-coach'
import { vivaInterviewPractice } from './college/viva-interview-practice'
import { doubtSolver } from './school/doubt-solver'
import { examRevisionQuizzer } from './school/exam-revision-quizzer'
import { explainLike12 } from './school/explain-like-12'
import { homeworkHelper } from './school/homework-helper'
import { languagePractice } from './school/language-practice'

// All 10 starter templates: 5 school + 5 college.
export const templates: Template[] = [
  homeworkHelper,
  examRevisionQuizzer,
  explainLike12,
  languagePractice,
  doubtSolver,
  courseStudyBuddy,
  vivaInterviewPractice,
  resumeCoach,
  projectMentor,
  codingExplainer,
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

export function getTemplatesByAudience(audience: Audience): Template[] {
  return templates.filter((t) => t.audiences.includes(audience))
}
