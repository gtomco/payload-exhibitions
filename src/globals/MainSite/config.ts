import type { Field, GlobalConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { colorField } from '../../fields/colorPicker'
import { revalidateTag } from 'next/cache'

function enSq(
  name: string,
  label: string,
  type: 'text' | 'textarea' = 'text',
  defaults?: { en?: string; sq?: string },
): Field {
  if (type === 'textarea') {
    return {
      type: 'row',
      fields: [
        { name: `${name}En`, type: 'textarea', label: `${label} (EN)`, defaultValue: defaults?.en },
        { name: `${name}Sq`, type: 'textarea', label: `${label} (SQ)`, defaultValue: defaults?.sq },
      ],
    }
  }
  return {
    type: 'row',
    fields: [
      { name: `${name}En`, type: 'text', label: `${label} (EN)`, defaultValue: defaults?.en },
      { name: `${name}Sq`, type: 'text', label: `${label} (SQ)`, defaultValue: defaults?.sq },
    ],
  }
}
export const MainSite: GlobalConfig = {
  slug: 'main-site',
  label: 'IX Main Site',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description:
      'Corporate i-exhibitions.com homepage — every section, platform link, news card, video, and theme color.',
    group: 'Platform',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Theme',
          fields: [
            {
              name: 'theme',
              type: 'group',
              label: 'Colors',
              admin: {
                description: 'Brand palette (default: 80% white / 15% black / 5% IX orange).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    colorField({ name: 'black', label: 'Black', defaultValue: '#000000' }),
                    colorField({ name: 'white', label: 'White', defaultValue: '#FFFFFF' }),
                    colorField({
                      name: 'accent',
                      label: 'Accent (IX Orange)',
                      defaultValue: '#ff4c00',
                    }),
                    colorField({ name: 'grey', label: 'Light grey', defaultValue: '#c9c9c9' }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    colorField({ name: 'soft', label: 'Soft section bg', defaultValue: '#f6f6f6' }),
                    colorField({ name: 'film', label: 'Film banner bg', defaultValue: '#f7efe8' }),
                    colorField({ name: 'muted', label: 'Muted text', defaultValue: '#8a8a8a' }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            enSq('seoTitle', 'Meta title', 'text', {
              en: 'IX Exhibitions — Industry platforms & trade fairs',
              sq: 'IX Exhibitions — Platforma industrie dhe panairë B2B',
            }),
            enSq('seoDescription', 'Meta description', 'textarea', {
              en: 'We build platforms — recurring meeting points where entire industries come together to open markets, spark collaboration and grow.',
              sq: 'Ndërtojmë platforma — pika takimi të përsëritura ku industri të tëra bashkohen për të hapur tregje, bashkëpunim dhe rritje.',
            }),
          ],
        },
        {
          label: 'Navigation',
          fields: [
            enSq('navAbout', 'About', 'text', { en: 'About IX', sq: 'Rreth IX' }),
            enSq('navEvents', 'Events', 'text', { en: 'IX Events', sq: 'Eventet IX' }),
            enSq('navCulture', 'Culture', 'text', { en: 'Our Culture', sq: 'Kultura jonë' }),
            enSq('navNews', 'News', 'text', { en: 'News & Media', sq: 'Lajme & Media' }),
            enSq('navContact', 'Contact', 'text', { en: 'Get In Touch', sq: 'Na kontaktoni' }),
          ],
        },
        {
          label: 'Hero',
          fields: [
            enSq('heroEyebrow', 'Eyebrow', 'text', {
              en: 'I - EXHIBITIONS · TIRANA, ALBANIA',
              sq: 'I - EXHIBITIONS · TIRANË, SHQIPËRI',
            }),
            enSq('heroTitle', 'Title line', 'text', {
              en: 'Today we build industry platforms as',
              sq: 'Sot ndërtojmë platforma industrie si',
            }),
            enSq('heroBrand', 'Brand word', 'text', { en: 'IX.', sq: 'IX.' }),
            enSq('heroBody', 'Body', 'textarea', {
              en: 'We no longer see exhibitions as standalone events. We build platforms — recurring meeting points where entire industries come together to open markets, spark collaboration and grow.',
              sq: 'Nuk i shohim më panairët si ngjarje të izoluara. Ne ndërtojmë platforma — pika takimi të përsëritura ku industri të tëra bashkohen për të hapur tregje, bashkëpunim dhe rritje.',
            }),
            enSq('heroCtaPrimary', 'Primary CTA', 'text', {
              en: 'Explore our platforms',
              sq: 'Eksploro platformat',
            }),
            enSq('heroCtaSecondary', 'Secondary CTA', 'text', {
              en: 'The IX story',
              sq: 'Historia e IX',
            }),
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero photo',
            },
            enSq('heroCaption', 'Image caption', 'text', {
              en: 'WHERE SECTORS MEET — TIRANA',
              sq: 'KU SEKTORËT TAKOHEN — TIRANË',
            }),
          ],
        },
        {
          label: 'Platforms',
          fields: [
            enSq('platformsEyebrow', 'Eyebrow', 'text', { en: 'IX Events', sq: 'Eventet IX' }),
            enSq('platformsHeading', 'Heading', 'text', {
              en: 'Four platforms. Five industries. One network.',
              sq: 'Katër platforma. Pesë industri. Një rrjet.',
            }),
            enSq('platformsIntro', 'Intro', 'textarea', {
              en: "Each platform brings together the people, businesses and ideas shaping one of the region's most important sectors.",
              sq: 'Çdo platformë bashkon njerëzit, bizneset dhe idetë që formësojnë një nga sektorët më të rëndësishëm të rajonit.',
            }),
            enSq('platformsSeeAll', 'See all label', 'text', {
              en: 'See all platforms',
              sq: 'Shiko të gjitha platformat',
            }),
            {
              name: 'platforms',
              type: 'array',
              labels: { singular: 'Platform', plural: 'Platforms' },
              admin: {
                description:
                  'Fairs / platforms. “Microsite” → /m/{slug} (or production URL). “External” → custom URL (e.g. Future2Tech).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'titleEn', type: 'text', required: true, label: 'Title (EN)' },
                    { name: 'titleSq', type: 'text', required: true, label: 'Title (SQ)' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'subtitleEn', type: 'text', label: 'Subtitle (EN)' },
                    { name: 'subtitleSq', type: 'text', label: 'Subtitle (SQ)' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'blurbEn', type: 'textarea', label: 'Description (EN)' },
                    { name: 'blurbSq', type: 'textarea', label: 'Description (SQ)' },
                  ],
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (optional)',
                },
                {
                  name: 'linkType',
                  type: 'select',
                  required: true,
                  defaultValue: 'microsite',
                  options: [
                    { label: 'Microsite (same Payload app)', value: 'microsite' },
                    { label: 'External URL', value: 'external' },
                  ],
                },
                {
                  name: 'microsite',
                  type: 'relationship',
                  relationTo: 'microsites',
                  admin: {
                    condition: (_, sibling) => sibling?.linkType === 'microsite',
                  },
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  admin: {
                    condition: (_, sibling) => sibling?.linkType === 'external',
                  },
                },
                {
                  name: 'tickerLabel',
                  type: 'text',
                  label: 'Ticker word',
                  admin: { description: 'Marquee word, e.g. TOURISM' },
                },
              ],
            },
          ],
        },
        {
          label: 'Stats & story',
          fields: [
            {
              name: 'stats',
              type: 'array',
              maxRows: 6,
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'labelEn', type: 'text', required: true },
                { name: 'labelSq', type: 'text', required: true },
              ],
            },
            enSq('storyEyebrow', 'Story eyebrow', 'text', {
              en: 'FROM ICEBERG TO IX',
              sq: 'NGA ICEBERG NË IX',
            }),
            enSq('storyTitle', 'Story title', 'text', {
              en: 'We see platforms, not events.',
              sq: 'Ne shohim platforma, jo thjesht evente.',
            }),
            enSq('storyBody', 'Story body', 'textarea', {
              en: "For years, we were known as Iceberg Exhibitions. Today, we are IX. The change reflects how our company has evolved — from standalone events to platforms that bring industries together, open new markets and support growth.\n\nEvery exhibition we create starts with a sector. Its challenges. Its opportunities. Its future. That focus has helped us build some of Albania's leading business events.",
              sq: 'Për vite ishim të njohur si Iceberg Exhibitions. Sot jemi IX. Ndryshimi pasqyron evolucionin e kompanisë — nga evente të izoluara në platforma që bashkojnë industri, hapin tregje dhe mbështesin rritjen.\n\nÇdo panair që krijojmë nis nga një sektor. Sfida e tij. Mundësitë. E ardhmja. Ky fokus na ka ndihmuar të ndërtojmë disa nga eventet kryesore të biznesit në Shqipëri.',
            }),
            enSq('storyCta', 'Story link', 'text', {
              en: 'Read the full story',
              sq: 'Lexo historinë e plotë',
            }),
            enSq('storyBadge', 'Image badge', 'text', {
              en: 'Est. in Tirana',
              sq: 'Themeluar në Tiranë',
            }),
            { name: 'storyImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Culture & team',
          fields: [
            enSq('cultureEyebrow', 'Eyebrow', 'text', { en: 'Our culture', sq: 'Kultura jonë' }),
            enSq('cultureTitleBefore', 'Title (before accent)', 'text', {
              en: 'Our business is built on',
              sq: 'Biznesi ynë ndërtohet mbi',
            }),
            enSq('cultureTitleAccent', 'Title accent', 'text', {
              en: 'relationships.',
              sq: 'marrëdhënie.',
            }),
            enSq('cultureBody', 'Body', 'textarea', {
              en: 'The relationships we create for our clients. The relationships we build with our partners. And the relationships we build with each other. Different experiences, different strengths — one shared purpose.',
              sq: 'Marrëdhëniet që krijojmë për klientët. Marrëdhëniet me partnerët. Dhe marrëdhëniet midis nesh. Përvoja të ndryshme, forca të ndryshme — një qëllim i përbashkët.',
            }),
            enSq('cultureMeetTeam', 'Meet team label', 'text', {
              en: 'Meet the team',
              sq: 'Njih ekipin',
            }),
            {
              name: 'cultureValues',
              type: 'array',
              labels: { singular: 'Value', plural: 'Values' },
              admin: { description: '“What We Stand For” principles' },
              fields: [
                { name: 'titleEn', type: 'text', required: true },
                { name: 'titleSq', type: 'text', required: true },
                { name: 'bodyEn', type: 'textarea' },
                { name: 'bodySq', type: 'textarea' },
              ],
            },
            enSq('missionTitle', 'Mission title', 'text', { en: 'Mission', sq: 'Misioni' }),
            enSq('missionBody', 'Mission body', 'textarea', {
              en: 'To create platforms that bring industries together, encourage the exchange of knowledge and ideas, and support business growth.',
              sq: 'Të krijojmë platforma që bashkojnë industri, nxisin shkëmbimin e njohurive dhe ideve, dhe mbështesin rritjen e biznesit.',
            }),
            {
              name: 'team',
              type: 'array',
              labels: { singular: 'Person', plural: 'Team' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'roleEn', type: 'text', required: true },
                { name: 'roleSq', type: 'text', required: true },
                { name: 'initials', type: 'text', admin: { description: 'Avatar initials, e.g. ES' } },
                { name: 'photo', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Services',
          fields: [
            enSq('servicesEyebrow', 'Eyebrow', 'text', { en: 'Services', sq: 'Shërbimet' }),
            enSq('servicesHeading', 'Heading', 'text', {
              en: 'How we build industry platforms.',
              sq: 'Si ndërtojmë platforma industrie.',
            }),
            {
              name: 'services',
              type: 'array',
              fields: [
                { name: 'titleEn', type: 'text', required: true },
                { name: 'titleSq', type: 'text', required: true },
                { name: 'bodyEn', type: 'textarea' },
                { name: 'bodySq', type: 'textarea' },
                { name: 'ctaEn', type: 'text' },
                { name: 'ctaSq', type: 'text' },
                { name: 'ctaHref', type: 'text', admin: { description: 'Anchor or URL, e.g. #contact' } },
              ],
            },
          ],
        },
        {
          label: 'Film, news & video',
          fields: [
            enSq('filmEyebrow', 'Film eyebrow', 'text', { en: 'Watch the film', sq: 'Shiko filmin' }),
            enSq('filmTitle', 'Film title', 'textarea', {
              en: 'See what happens when an industry meets on an IX platform.',
              sq: 'Shih çfarë ndodh kur një industri takohet në një platformë IX.',
            }),
            enSq('filmMeta', 'Film meta', 'text', { en: '3 min film', sq: 'Film 3 min' }),
            { name: 'filmUrl', type: 'text', label: 'Film YouTube URL' },
            enSq('newsEyebrow', 'News eyebrow', 'text', { en: 'News & media', sq: 'Lajme & media' }),
            enSq('newsHeading', 'News heading', 'text', {
              en: "What's next on the calendar.",
              sq: 'Çfarë vjen në kalendar.',
            }),
            enSq('newsAllLabel', 'All news label', 'text', {
              en: 'All news & media',
              sq: 'Të gjitha lajmet & media',
            }),
            {
              name: 'newsItems',
              type: 'array',
              labels: { singular: 'News card', plural: 'News cards' },
              fields: [
                { name: 'categoryEn', type: 'text' },
                { name: 'categorySq', type: 'text' },
                { name: 'titleEn', type: 'text', required: true },
                { name: 'titleSq', type: 'text', required: true },
                { name: 'bodyEn', type: 'textarea' },
                { name: 'bodySq', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'href', type: 'text' },
              ],
            },
            {
              name: 'videos',
              type: 'array',
              labels: { singular: 'Video', plural: 'Videos' },
              admin: { description: 'YouTube links (cover + click-through)' },
              fields: [
                { name: 'titleEn', type: 'text', required: true },
                { name: 'titleSq', type: 'text', required: true },
                { name: 'youtubeUrl', type: 'text', required: true },
                { name: 'cover', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Gallery',
          fields: [
            enSq('galleryEyebrow', 'Gallery eyebrow', 'text', {
              en: 'Gallery',
              sq: 'Galeria',
            }),
            enSq('galleryHeading', 'Gallery heading', 'text', {
              en: 'Moments from our platforms.',
              sq: 'Momente nga platformat tona.',
            }),
            enSq('galleryIntro', 'Gallery intro', 'textarea', {
              en: 'A look at the industries meeting on IX floors across Albania.',
              sq: 'Një vështrim mbi industritë që takohen në platformat IX në Shqipëri.',
            }),
            {
              name: 'galleryItems',
              type: 'array',
              labels: { singular: 'Photo', plural: 'Photos' },
              admin: {
                description:
                  'Drag to reorder. Upload compressed photos to Media first — grid uses medium thumbs; click opens a larger size.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                { name: 'captionEn', type: 'text', label: 'Caption (EN)' },
                { name: 'captionSq', type: 'text', label: 'Caption (SQ)' },
              ],
            },
          ],
        },
        {
          label: 'CTA & contact',
          fields: [
            enSq('ctaEyebrow', 'CTA eyebrow', 'text', {
              en: "Let's build something",
              sq: 'Le të ndërtojmë diçka',
            }),
            enSq('ctaTitle', 'CTA title', 'text', {
              en: 'Create the next platform for your industry.',
              sq: 'Krijoni platformën e ardhshme për industrinë tuaj.',
            }),
            enSq('ctaButton', 'CTA button', 'text', {
              en: 'Start a conversation',
              sq: 'Fillo një bisedë',
            }),
            enSq('footerTagline', 'Footer tagline', 'textarea', {
              en: 'I-Exhibitions — B2B exhibition platforms. Tirana, Albania.',
              sq: 'I-Exhibitions — Platforma B2B panairesh. Tiranë, Shqipëri.',
            }),
            enSq('footerExplore', 'Explore column', 'text', { en: 'Explore', sq: 'Eksploro' }),
            enSq('footerPlatforms', 'Platforms column', 'text', { en: 'Platforms', sq: 'Platformat' }),
            enSq('footerConnect', 'Connect column', 'text', { en: 'Connect', sq: 'Lidhu' }),
            enSq('copyright', 'Copyright', 'text', {
              en: '© 2024 I-Exhibitions. All rights reserved.',
              sq: '© 2024 I-Exhibitions. Të gjitha të drejtat e rezervuara.',
            }),
            { name: 'contactEmail', type: 'email', defaultValue: 'info@icebergexhibitions.com' },
            { name: 'contactPhone', type: 'text', defaultValue: '+355 69 406 3909' },
            enSq('address', 'Address', 'textarea', {
              en: 'Str. Tish Dahija, Kika 2, 6th Floor\nTirana, Albania',
              sq: 'Rr. Tish Dahija, Kika 2, kati 6\nTiranë, Shqipëri',
            }),
            { name: 'instagram', type: 'text' },
            { name: 'facebook', type: 'text' },
            { name: 'linkedin', type: 'text' },
            { name: 'youtube', type: 'text' },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag('global_main-site', 'max')
        } catch {
          // Seed scripts / non-Next contexts have no static generation store.
        }
      },
    ],
  },
}
