import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  contentBlock,
  lexicalFaqItem,
  lexicalHeading,
  lexicalParagraph,
  lexicalPriceCard,
} from './ecgeLexical'

type LegacyPriceSpace = {
  typeSq: string
  typeEn: string
  price: string
  vatSq: string
  vatEn: string
  featuresSq: string[]
  featuresEn: string[]
}

type LegacyPricePartner = {
  type: string
  visibility: string
  m2: string
  price: string
  vatSq: string
  vatEn: string
  featuresSq: string[]
  featuresEn: string[]
}

type LegacyPublic = {
  priceList?: {
    space?: LegacyPriceSpace[]
    partners?: LegacyPricePartner[]
  }
}

const FAQ_SQ: Array<[string, string]> = [
  [
    'Si regjistrohem si ekspozues?',
    'Hap Regjistrimin e Stendës, plotëso formularin dhe dërgo kërkesën. Ekipi i shitjeve do të konfirmojë disponueshmërinë dhe do t\'ju kontaktojë.',
  ],
  [
    'Si e marrin vizitorët biletën?',
    'Hap Regjistrimin e Vizitorit dhe plotëso formularin. Sistemi gjeneron një biletë me kod unik QR pas regjistrimit.',
  ],
  [
    'A mund të zgjedh një stendë nga planimetria?',
    'Po. Planimetria interaktive tregon statusin e stendave dhe ekspozuesit e konfirmuar. Vendosja përfundimtare menaxhohet nga administratori.',
  ],
  [
    'Ku menaxhohen takimet B2B?',
    'Takimet menaxhohen përmes B2Balkan. Kërkesat për stenda dërgohen veçmas në CRM-në e shitjeve kur integrimi është aktiv.',
  ],
  [
    'Ku ngarkohen logot, videot dhe banner-at?',
    'Përdor Admin > Media për logon, videon promo, posterin, galerinë, lajmet dhe materialet e sponsorëve.',
  ],
]

function loadLegacyPublic(): LegacyPublic {
  const legacyPath = path.resolve(
    fileURLToPath(new URL('.', import.meta.url)),
    '../../../../ecge-fair/web/public/legacy-public.json',
  )
  return JSON.parse(readFileSync(legacyPath, 'utf8')) as LegacyPublic
}

export function buildPricesPageLayout() {
  const legacy = loadLegacyPublic()
  const space = legacy.priceList?.space || []
  const partners = legacy.priceList?.partners || []

  return [
    contentBlock(
      [{ size: 'full', richText: lexicalHeading('Hapesira ekspozuese', 'h2') }],
      'section-heading',
    ),
    contentBlock(
      space.map((item) => ({
        size: 'half' as const,
        richText: lexicalPriceCard(item.typeSq, item.price, item.vatSq, item.featuresSq),
      })),
      'price-space',
    ),
    contentBlock(
      [{ size: 'full', richText: lexicalHeading('Paketa partneriteti', 'h2') }],
      'section-heading',
    ),
    contentBlock(
      partners.map((item) => ({
        size: 'oneThird' as const,
        richText: lexicalPriceCard(
          item.type,
          item.price,
          `${item.m2} · ${item.visibility} · ${item.vatSq}`,
          item.featuresSq,
        ),
      })),
      'price-partners',
    ),
    contentBlock(
      [
        {
          size: 'full',
          richText: lexicalParagraph(
            'Konfiguruar sipas materialit te cmimeve per ECGE 2026. Te gjitha fushat editohen nga admini ne Payload CMS.',
          ),
        },
      ],
      'section-note',
    ),
  ]
}

export function buildFaqPageLayout() {
  return [
    contentBlock(
      [
        {
          size: 'full',
          richText: lexicalParagraph('Pyetjet kryesore per vizitore, ekspozues dhe partnere.'),
        },
      ],
      'section-intro',
    ),
    contentBlock(
      FAQ_SQ.map(([question, answer]) => ({
        size: 'full' as const,
        richText: lexicalFaqItem(question, answer),
      })),
      'faq-list',
    ),
  ]
}
