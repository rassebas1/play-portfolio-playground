const PROFANITY_LIST = [
  'fuck',
  'shit',
  'ass',
  'bitch',
  'damn',
  'bastard',
  'crap',
  'dick',
  'cock',
  'pussy',
  'cunt',
  'whore',
  'slut',
  'fag',
  'nigger',
  'retard',
  'idiot',
  'stupid',
  'dumb'
]

export const PROFANITY_FILTER_VERSION = '1.0.0'

export function getProfanityList(): string[] {
  return [...PROFANITY_LIST]
}

export function addToProfanityList(words: string[]): void {
  words.forEach(word => {
    const normalized = word.toLowerCase().trim()
    if (normalized && !PROFANITY_LIST.includes(normalized)) {
      PROFANITY_LIST.push(normalized)
    }
  })
}

export function removeFromProfanityList(words: string[]): void {
  words.forEach(word => {
    const normalized = word.toLowerCase().trim()
    const index = PROFANITY_LIST.indexOf(normalized)
    if (index > -1) {
      PROFANITY_LIST.splice(index, 1)
    }
  })
}

export function containsProfanity(username: string): boolean {
  const normalized = username.toLowerCase()
  
  for (const word of PROFANITY_LIST) {
    if (normalized.includes(word)) {
      return true
    }
  }
  
  return false
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  const clean = username.toUpperCase().replace(/[^A-Z0-9]/g, '')
  
  if (clean.length === 0) {
    return { valid: false, error: 'Username cannot be empty' }
  }
  
  if (clean.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }
  
  if (clean.length > 7) {
    return { valid: false, error: 'Username must be 7 characters or less' }
  }
  
  if (containsProfanity(username)) {
    return { valid: false, error: 'Username contains inappropriate words' }
  }
  
  return { valid: true }
}
