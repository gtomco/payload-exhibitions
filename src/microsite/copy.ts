import type { PublicLang } from '@/microsite/constants'

const strings = {
  sq: {
    edition: 'Edicioni i 5-te',
    date: '29-30 Tetor 2026',
    venue: 'Pallati i Kongreseve, Tirane',
    registerVisitor: 'Regjistrohu si vizitor',
    registerExhibitor: 'Regjistrohu si ekspozues',
  },
  en: {
    edition: '5th Edition',
    date: '29-30 October 2026',
    venue: 'Palace of Congresses, Tirana',
    registerVisitor: 'Register as Visitor',
    registerExhibitor: 'Register as Exhibitor',
  },
} as const

export function copy(lang: PublicLang, key: keyof (typeof strings)['sq']) {
  return strings[lang][key]
}

export function langChoice(lang: PublicLang, sq: string, en: string) {
  return lang === 'sq' ? sq : en
}
