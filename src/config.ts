export const APP_NAME = 'BotForge'

export const APP_TAGLINE = 'Build your own study chatbot prompt'

export const STORAGE_KEYS = {
  audience: 'botforge:audience',
  savedPrompts: 'botforge:saved-prompts',
  builderState: 'botforge:builder-state',
} as const

export const LIMITS = {
  maxSavedPrompts: 50,
} as const
