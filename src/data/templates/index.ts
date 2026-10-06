import type { Template } from '../../types'

// Phase 1 placeholder: full template content lands in Phase 2 (2 templates)
// and Phase 5 (remaining 8). Registry helpers arrive with real data.
export const templates: Template[] = []

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

export function getTemplatesByAudience(
  audience: Template['audiences'][number],
): Template[] {
  return templates.filter((t) => t.audiences.includes(audience))
}
