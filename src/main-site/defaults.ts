import type { PublicLang } from '@/microsite/constants'

export type IxTheme = {
  black: string
  white: string
  accent: string
  grey: string
  soft: string
  film: string
  muted: string
}

export type IxPlatformLink = {
  title: string
  subtitle: string
  blurb: string
  href: string
  external: boolean
  tickerLabel: string
  logoUrl?: string | null
}

export type IxMainContent = {
  theme: IxTheme
  nav: {
    about: string
    events: string
    culture: string
    news: string
    contact: string
  }
  heroEyebrow: string
  heroTitle: string
  heroBrand: string
  heroBody: string
  heroCtaPrimary: string
  heroCtaSecondary: string
  heroCaption: string
  heroImageUrl: string
  platformsEyebrow: string
  platformsHeading: string
  platformsIntro: string
  platformsSeeAll: string
  platforms: IxPlatformLink[]
  stats: Array<{ value: string; label: string }>
  storyEyebrow: string
  storyTitle: string
  storyBody: string
  storyCta: string
  storyBadge: string
  storyImageUrl: string
  cultureEyebrow: string
  cultureTitleBefore: string
  cultureTitleAccent: string
  cultureBody: string
  cultureMeetTeam: string
  cultureValues: Array<{ title: string; body: string }>
  missionTitle: string
  missionBody: string
  team: Array<{ name: string; role: string; initials: string; photoUrl?: string | null }>
  servicesEyebrow: string
  servicesHeading: string
  services: Array<{ title: string; body: string; cta: string; href: string }>
  filmEyebrow: string
  filmTitle: string
  filmMeta: string
  filmUrl: string
  newsEyebrow: string
  newsHeading: string
  newsAllLabel: string
  newsItems: Array<{
    category: string
    title: string
    body: string
    imageUrl: string
    href?: string
  }>
  videos: Array<{ title: string; youtubeUrl: string; coverUrl?: string | null }>
  ctaEyebrow: string
  ctaTitle: string
  ctaButton: string
  footerTagline: string
  footerExplore: string
  footerPlatforms: string
  footerConnect: string
  copyright: string
  contactEmail: string
  contactPhone: string
  address: string
  social: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string }
}

export const IX_DEFAULT_THEME: IxTheme = {
  black: '#000000',
  white: '#FFFFFF',
  accent: '#ff4c00',
  grey: '#c9c9c9',
  soft: '#f6f6f6',
  film: '#f7efe8',
  muted: '#8a8a8a',
}

const DEFAULT_PLATFORMS = [
  {
    titleEn: 'Tourism Fair Albania',
    titleSq: 'Tourism Fair Albania',
    subtitleEn: 'Tourism & hospitality',
    subtitleSq: 'Turizëm & mikpritje',
    blurbEn:
      'Where tourism professionals connect to build partnerships, discover opportunities and shape the future of travel and hospitality.',
    blurbSq:
      'Ku profesionistët e turizmit lidhen për partneritete, mundësi dhe të ardhmen e udhëtimit e mikpritjes.',
    linkType: 'external' as const,
    externalUrl: 'https://tfa.i-exhibitions.com',
    tickerLabel: 'TOURISM',
  },
  {
    titleEn: 'Future2Tech',
    titleSq: 'Future2Tech',
    subtitleEn: 'Business, technology & education',
    subtitleSq: 'Biznes, teknologji & arsim',
    blurbEn:
      'Where business, technology and education come together to explore innovation, emerging trends and the skills needed for tomorrow.',
    blurbSq:
      'Ku biznesi, teknologjia dhe arsimi bashkohen për inovacion, trende dhe aftësitë e së nesërmes.',
    linkType: 'external' as const,
    externalUrl: 'https://futuretotech.al',
    tickerLabel: 'TECHNOLOGY',
  },
  {
    titleEn: 'Energy, Construction & Green Economy',
    titleSq: 'Energji, Ndërtim & Ekonomi e Gjelbër',
    subtitleEn: 'Infrastructure, energy & sustainability',
    subtitleSq: 'Infrastrukturë, energji & qëndrueshmëri',
    blurbEn:
      'Where industry leaders, policymakers and innovators come together to discuss the future of infrastructure, energy and sustainable development.',
    blurbSq:
      'Ku liderët e industrisë, politikëbërësit dhe inovatorët diskutojnë të ardhmen e infrastrukturës, energjisë dhe zhvillimit të qëndrueshëm.',
    linkType: 'microsite' as const,
    micrositeSlug: 'ecge',
    tickerLabel: 'ENERGY',
  },
  {
    titleEn: 'Agriculture Days',
    titleSq: 'Agriculture Days',
    subtitleEn: 'Agriculture',
    subtitleSq: 'Bujqësi',
    blurbEn:
      'Where the agricultural community meets to exchange knowledge, showcase innovation and support the growth of a vital sector.',
    blurbSq:
      'Ku komuniteti bujqësor takohet për shkëmbim njohurish, inovacion dhe rritjen e një sektori jetik.',
    linkType: 'external' as const,
    externalUrl: 'https://agridays.i-exhibitions.com',
    tickerLabel: 'AGRICULTURE',
  },
]

const TEAM = [
  { name: 'Enejda Sheku', roleEn: 'Co-founder & CEO', roleSq: 'Bashkëthemeluese & CEO', initials: 'ES' },
  {
    name: 'Arben Oshafi',
    roleEn: 'Sales & Operations Director',
    roleSq: 'Drejtor i Shitjeve & Operacioneve',
    initials: 'AO',
  },
  { name: 'Armela Cami', roleEn: 'Account Manager', roleSq: 'Account Manager', initials: 'AC' },
  { name: 'Florentin Kavalli', roleEn: 'Account Manager', roleSq: 'Account Manager', initials: 'FK' },
  {
    name: 'Sabina Karini',
    roleEn: 'Marketing & Communications Specialist',
    roleSq: 'Specialiste Marketing & Komunikimi',
    initials: 'SK',
  },
  { name: 'Xhesika Berisha', roleEn: 'Creative Designer', roleSq: 'Designer Kreative', initials: 'XB' },
  {
    name: 'Laura Gjinaj',
    roleEn: 'Finance & Administrative Specialist',
    roleSq: 'Specialiste Finance & Administrate',
    initials: 'LG',
  },
]

export function defaultIxContent(lang: PublicLang): IxMainContent {
  const sq = lang === 'sq'
  return {
    theme: { ...IX_DEFAULT_THEME },
    nav: {
      about: sq ? 'Rreth IX' : 'About IX',
      events: sq ? 'Eventet IX' : 'IX Events',
      culture: sq ? 'Kultura jonë' : 'Our Culture',
      news: sq ? 'Lajme & Media' : 'News & Media',
      contact: sq ? 'Na kontaktoni' : 'Get In Touch',
    },
    heroEyebrow: sq ? 'I - EXHIBITIONS · TIRANË, SHQIPËRI' : 'I - EXHIBITIONS · TIRANA, ALBANIA',
    heroTitle: sq ? 'Sot, ne jemi' : 'Today, we are',
    heroBrand: 'IX.',
    heroBody: sq
      ? 'Nuk i shohim më panairët si ngjarje të izoluara. Ne ndërtojmë platforma — pika takimi të përsëritura ku industri të tëra bashkohen për të hapur tregje, bashkëpunim dhe rritje.'
      : 'We no longer see exhibitions as standalone events. We build platforms — recurring meeting points where entire industries come together to open markets, spark collaboration and grow.',
    heroCtaPrimary: sq ? 'Eksploro platformat' : 'Explore our platforms',
    heroCtaSecondary: sq ? 'Historia e IX' : 'The IX story',
    heroCaption: sq ? 'KU SEKTORËT TAKOHEN — TIRANË' : 'WHERE SECTORS MEET — TIRANA',
    heroImageUrl: '/ix/hero-venue.png',
    platformsEyebrow: sq ? 'Eventet IX' : 'IX Events',
    platformsHeading: sq
      ? 'Katër platforma. Pesë industri. Një rrjet.'
      : 'Four platforms. Five industries. One network.',
    platformsIntro: sq
      ? 'Çdo platformë bashkon njerëzit, bizneset dhe idetë që formësojnë një nga sektorët më të rëndësishëm të rajonit.'
      : "Each platform brings together the people, businesses and ideas shaping one of the region's most important sectors.",
    platformsSeeAll: sq ? 'Shiko të gjitha platformat' : 'See all platforms',
    platforms: DEFAULT_PLATFORMS.map((p) => ({
      title: sq ? p.titleSq : p.titleEn,
      subtitle: sq ? p.subtitleSq : p.subtitleEn,
      blurb: sq ? p.blurbSq : p.blurbEn,
      href: p.linkType === 'microsite' ? `/m/${p.micrositeSlug}` : p.externalUrl,
      external: p.linkType === 'external',
      tickerLabel: p.tickerLabel,
    })),
    stats: [
      { value: '04', label: sq ? 'Platforma industrie' : 'Industry platforms' },
      { value: '05', label: sq ? 'Sektorë të lidhur' : 'Sectors connected' },
      { value: '100+', label: sq ? 'Biznese & partnerë' : 'Businesses & partners' },
      { value: '1', label: sq ? 'Rrjet që lëviz industri' : 'Network moving industries forward' },
    ],
    storyEyebrow: sq ? 'NGA ICEBERG NË IX' : 'FROM ICEBERG TO IX',
    storyTitle: sq ? 'Ne shohim platforma, jo thjesht evente.' : 'We see platforms, not events.',
    storyBody: sq
      ? 'Për vite ishim të njohur si Iceberg Exhibitions. Sot jemi IX. Ndryshimi pasqyron evolucionin e kompanisë — nga evente të izoluara në platforma që bashkojnë industri, hapin tregje dhe mbështesin rritjen.\n\nÇdo panair që krijojmë nis nga një sektor. Sfida e tij. Mundësitë. E ardhmja. Ky fokus na ka ndihmuar të ndërtojmë disa nga eventet kryesore të biznesit në Shqipëri.'
      : "For years, we were known as Iceberg Exhibitions. Today, we are IX. The change reflects how our company has evolved — from standalone events to platforms that bring industries together, open new markets and support growth.\n\nEvery exhibition we create starts with a sector. Its challenges. Its opportunities. Its future. That focus has helped us build some of Albania's leading business events.",
    storyCta: sq ? 'Lexo historinë e plotë' : 'Read the full story',
    storyBadge: sq ? 'Themeluar në Tiranë' : 'Est. in Tirana',
    storyImageUrl: '/ix/story-venue.png',
    cultureEyebrow: sq ? 'Kultura jonë' : 'Our culture',
    cultureTitleBefore: sq ? 'Biznesi ynë ndërtohet mbi' : 'Our business is built on',
    cultureTitleAccent: sq ? 'marrëdhënie.' : 'relationships.',
    cultureBody: sq
      ? 'Marrëdhëniet që krijojmë për klientët. Marrëdhëniet me partnerët. Dhe marrëdhëniet midis nesh. Përvoja të ndryshme, forca të ndryshme — një qëllim i përbashkët.'
      : 'The relationships we create for our clients. The relationships we build with our partners. And the relationships we build with each other. Different experiences, different strengths — one shared purpose.',
    cultureMeetTeam: sq ? 'Njih ekipin' : 'Meet the team',
    cultureValues: [
      {
        title: sq ? 'Industritë rriten përmes lidhjes' : 'Industries Grow Through Connection',
        body: sq
          ? 'Progresi ndodh kur bizneset, institucionet dhe njerëzit bashkohen rreth sfidave dhe mundësive të përbashkëta.'
          : 'Progress happens when businesses, institutions and people come together around shared challenges and opportunities.',
      },
      {
        title: sq ? 'Ekspertiza krijon vlerë' : 'Expertise Creates Value',
        body: sq
          ? 'Fokusohemi te sektorët që i kuptojmë, duke ndërtuar platforma që i përgjigjen nevojave reale.'
          : 'We focus on sectors we understand, building platforms that respond to the real needs of the industries we serve.',
      },
      {
        title: sq ? 'Rritja kërkon shkëmbim' : 'Growth Requires Exchange',
        body: sq
          ? 'Idetë e reja, njohuritë dhe partneritetet janë baza e rritjes së qëndrueshme.'
          : 'New ideas, knowledge and partnerships are the foundation of sustainable growth.',
      },
      {
        title: sq ? 'Evolucioni nuk ndalet' : 'Evolution Never Stops',
        body: sq
          ? 'Përshtatemi, inovojmë dhe përmirësojmë vazhdimisht mënyrën si lidhen industritë.'
          : 'We continuously adapt, innovate and improve the way industries connect and do business.',
      },
      {
        title: sq ? 'Marrëdhëniet kanë rëndësi' : 'Relationships Matter',
        body: sq
          ? 'Besimi afatgjatë është në zemër të çdo eventi, partneriteti dhe komuniteti që ndërtojmë.'
          : 'Long-term trust is at the heart of every event, partnership and community we build.',
      },
    ],
    missionTitle: sq ? 'Misioni' : 'Mission',
    missionBody: sq
      ? 'Të krijojmë platforma që bashkojnë industri, nxisin shkëmbimin e njohurive dhe ideve, dhe mbështesin rritjen e biznesit.'
      : 'To create platforms that bring industries together, encourage the exchange of knowledge and ideas, and support business growth.',
    team: TEAM.map((m) => ({
      name: m.name,
      role: sq ? m.roleSq : m.roleEn,
      initials: m.initials,
    })),
    servicesEyebrow: sq ? 'Shërbimet' : 'Services',
    servicesHeading: sq ? 'Si ndërtojmë platforma industrie.' : 'How we build industry platforms.',
    services: [
      {
        title: sq ? 'Zhvillim panairesh' : 'Trade Fair Development',
        body: sq
          ? 'Krijojmë panairë të fokusuara në industri që forcojnë sektorët dhe lidhin tregjet — nga koncepti te dorëzimi.'
          : 'We create and develop industry-focused trade fairs that strengthen industries and connect markets — from concept to delivery.',
        cta: sq ? 'Eksploro eventet' : 'Explore Our Events',
        href: '#events',
      },
      {
        title: sq ? 'Business Matchmaking' : 'Business Matchmaking',
        body: sq
          ? 'Takime B2B të kuruara, programe hosted buyer dhe agenda të përshtatura për mundësi të reja tregu.'
          : 'Curated B2B meetings, hosted buyer programmes and tailored agendas that unlock new market opportunities.',
        cta: sq ? 'Na kontaktoni' : 'Get in Touch',
        href: '#contact',
      },
      {
        title: sq ? 'Dizajn & ndërtim stendash' : 'Booth Design & Build',
        body: sq
          ? 'Stenda që kombinojnë kreativitet, funksionalitet dhe ndikim marke — nga koncepti te instalimi.'
          : 'Exhibition stands that combine creativity, functionality and brand impact — from concept to installation.',
        cta: sq ? 'Na kontaktoni' : 'Get in Touch',
        href: '#contact',
      },
    ],
    filmEyebrow: sq ? 'Shiko filmin' : 'Watch the film',
    filmTitle: sq
      ? 'Shih çfarë ndodh kur një industri takohet në një platformë IX.'
      : 'See what happens when an industry meets on an IX platform.',
    filmMeta: sq ? 'Film 3 min' : '3 min film',
    filmUrl: 'https://www.youtube.com/watch?v=SDqORu5_Klk',
    newsEyebrow: sq ? 'Lajme & media' : 'News & media',
    newsHeading: sq ? 'Çfarë vjen në kalendar.' : "What's next on the calendar.",
    newsAllLabel: sq ? 'Të gjitha lajmet & media' : 'All news & media',
    newsItems: [
      {
        category: sq ? 'Platformë — Pranverë' : 'Platform — Spring',
        title: sq
          ? 'Tourism Fair Albania kthehet në Tiranë'
          : 'Tourism Fair Albania returns to Tirana',
        body: sq
          ? 'Liderët e mikpritjes takohen për tregje të reja dhe sezonin që vjen.'
          : 'Hospitality leaders meet to open markets and shape the season ahead.',
        imageUrl: '/ix/news-ref.png',
        href: 'https://tfa.i-exhibitions.com',
      },
      {
        category: sq ? 'Platformë — 2024' : 'Platform — 2024',
        title: sq
          ? 'Future2Tech lidh biznesin dhe arsimin'
          : 'Future2Tech connects business and education',
        body: sq
          ? 'Inovacion, trende dhe aftësitë e së nesërmes.'
          : 'Innovation, emerging trends and the skills needed for tomorrow.',
        imageUrl: '/ix/hero-photo.png',
        href: 'https://futuretotech.al',
      },
      {
        category: sq ? 'Platformë — 2024' : 'Platform — 2024',
        title: sq ? 'Agriculture Days rritet me sektorin' : 'Agriculture Days grows with the sector',
        body: sq
          ? 'Shkëmbim njohurish dhe inovacion për një industri jetike.'
          : 'Knowledge exchange and innovation for a vital industry.',
        imageUrl: '/ix/story-photo.png',
        href: 'https://agridays.i-exhibitions.com',
      },
    ],
    videos: [
      {
        title: sq ? '1st Edition — Agriculture Days' : '1st Edition — Agriculture Days',
        youtubeUrl: 'https://www.youtube.com/watch?v=PojaToTqsC8',
      },
      {
        title: sq ? '1st Edition — Tourism Fair Albania' : '1st Edition — Tourism Fair Albania',
        youtubeUrl: 'https://www.youtube.com/watch?v=LBWWrAz0vCI',
      },
      {
        title: sq
          ? '1st Edition — Energy, Construction & Green Economy'
          : '1st Edition — Energy, Construction & Green Economy',
        youtubeUrl: 'https://www.youtube.com/watch?v=SDqORu5_Klk',
      },
    ],
    ctaEyebrow: sq ? 'Le të ndërtojmë diçka' : "Let's build something",
    ctaTitle: sq
      ? 'Krijoni platformën e ardhshme për industrinë tuaj.'
      : 'Create the next platform for your industry.',
    ctaButton: sq ? 'Fillo një bisedë' : 'Start a conversation',
    footerTagline: sq
      ? 'I-Exhibitions — Platforma B2B panairesh. Tiranë, Shqipëri.'
      : 'I-Exhibitions — B2B exhibition platforms. Tirana, Albania.',
    footerExplore: sq ? 'Eksploro' : 'Explore',
    footerPlatforms: sq ? 'Platformat' : 'Platforms',
    footerConnect: sq ? 'Lidhu' : 'Connect',
    copyright: sq
      ? '© 2024 I-Exhibitions. Të gjitha të drejtat e rezervuara.'
      : '© 2024 I-Exhibitions. All rights reserved.',
    contactEmail: 'info@icebergexhibitions.com',
    contactPhone: '+355 69 406 3909',
    address: sq
      ? 'Rr. Tish Dahija, Kika 2, kati 6\nTiranë, Shqipëri'
      : 'Str. Tish Dahija, Kika 2, 6th Floor\nTirana, Albania',
    social: {
      instagram: 'https://www.instagram.com/ecge_fair',
      facebook: 'https://www.facebook.com/icebergexhibitions',
      linkedin: 'https://www.linkedin.com/company/iceberg-exhibitions/',
      youtube: 'https://www.youtube.com',
    },
  }
}
