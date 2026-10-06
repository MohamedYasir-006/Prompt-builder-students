import { Link } from 'react-router-dom'
import type { Template } from '../../types'
import { Card } from '../ui/Card'
import { Tag } from '../ui/Tag'

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Card className="h-full">
      <Link
        to={`/build/${template.id}`}
        className="flex h-full flex-col gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label={`${template.title}: ${template.description}`}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-2xl">
            {template.icon}
          </span>
          <h2 className="text-lg font-bold">{template.title}</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {template.description}
        </p>
        <div className="mt-auto pt-1">
          <Tag label={template.category} />
        </div>
      </Link>
    </Card>
  )
}
