import type { Audience, Template } from '../../types'
import { courseStudyBuddy } from './college/course-study-buddy'
import { homeworkHelper } from './school/homework-helper'

// Phase 2 ships the first 2 templates. The remaining 8 land in Phase 5.
export const templates: Template[] = [homeworkHelper, courseStudyBuddy]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

export function getTemplatesByAudience(audience: Audience): Template[] {
  return templates.filter((t) => t.audiences.includes(audience))
}
