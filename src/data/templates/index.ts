import type { Audience, Template } from '../../types'
import { courseStudyBuddy } from './college/course-study-buddy'
import { doubtSolver } from './school/doubt-solver'
import { examRevisionQuizzer } from './school/exam-revision-quizzer'
import { explainLike12 } from './school/explain-like-12'
import { homeworkHelper } from './school/homework-helper'
import { languagePractice } from './school/language-practice'

// Phase 5a adds the 4 remaining school templates (6 total).
// The 4 college templates land in step 5b.
export const templates: Template[] = [
  homeworkHelper,
  examRevisionQuizzer,
  explainLike12,
  languagePractice,
  doubtSolver,
  courseStudyBuddy,
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

export function getTemplatesByAudience(audience: Audience): Template[] {
  return templates.filter((t) => t.audiences.includes(audience))
}
