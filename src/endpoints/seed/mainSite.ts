import type { Payload } from 'payload'

import { IX_DEFAULT_THEME } from '@/main-site/defaults'

type SeedOptions = {
  /** When true, overwrite existing non-empty main-site content. Default: fill only if empty. */
  force?: boolean
}

function isGlobalEmpty(doc: Record<string, unknown> | null | undefined): boolean {
  if (!doc) return true
  const hero = typeof doc.heroTitleEn === 'string' ? doc.heroTitleEn.trim() : ''
  const platforms = Array.isArray(doc.platforms) ? doc.platforms : []
  return !hero && platforms.length === 0
}

export function buildMainSiteSeedData(ecgeMicrositeId?: number | string) {
  return {
    theme: { ...IX_DEFAULT_THEME },
    navAboutEn: 'About IX',
    navAboutSq: 'Rreth IX',
    navEventsEn: 'IX Events',
    navEventsSq: 'Eventet IX',
    navCultureEn: 'Our Culture',
    navCultureSq: 'Kultura jonë',
    navNewsEn: 'News & Media',
    navNewsSq: 'Lajme & Media',
    navContactEn: 'Get In Touch',
    navContactSq: 'Na kontaktoni',
    heroEyebrowEn: 'I - EXHIBITIONS · TIRANA, ALBANIA',
    heroEyebrowSq: 'I - EXHIBITIONS · TIRANË, SHQIPËRI',
    heroTitleEn: 'Today, we are',
    heroTitleSq: 'Sot, ne jemi',
    heroBrandEn: 'IX.',
    heroBrandSq: 'IX.',
    heroBodyEn:
      'We no longer see exhibitions as standalone events. We build platforms — recurring meeting points where entire industries come together to open markets, spark collaboration and grow.',
    heroBodySq:
      'Nuk i shohim më panairët si ngjarje të izoluara. Ne ndërtojmë platforma — pika takimi të përsëritura ku industri të tëra bashkohen për të hapur tregje, bashkëpunim dhe rritje.',
    heroCtaPrimaryEn: 'Explore our platforms',
    heroCtaPrimarySq: 'Eksploro platformat',
    heroCtaSecondaryEn: 'The IX story',
    heroCtaSecondarySq: 'Historia e IX',
    heroCaptionEn: 'WHERE SECTORS MEET — TIRANA',
    heroCaptionSq: 'KU SEKTORËT TAKOHEN — TIRANË',
    platformsEyebrowEn: 'IX Events',
    platformsEyebrowSq: 'Eventet IX',
    platformsHeadingEn: 'Four platforms. Five industries. One network.',
    platformsHeadingSq: 'Katër platforma. Pesë industri. Një rrjet.',
    platformsIntroEn:
      "Each platform brings together the people, businesses and ideas shaping one of the region's most important sectors.",
    platformsIntroSq:
      'Çdo platformë bashkon njerëzit, bizneset dhe idetë që formësojnë një nga sektorët më të rëndësishëm të rajonit.',
    platformsSeeAllEn: 'See all platforms',
    platformsSeeAllSq: 'Shiko të gjitha platformat',
    platforms: [
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
        ...(ecgeMicrositeId ? { microsite: ecgeMicrositeId } : {}),
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
    ],
    stats: [
      { value: '04', labelEn: 'Industry platforms', labelSq: 'Platforma industrie' },
      { value: '05', labelEn: 'Sectors connected', labelSq: 'Sektorë të lidhur' },
      { value: '100+', labelEn: 'Businesses & partners', labelSq: 'Biznese & partnerë' },
      {
        value: '1',
        labelEn: 'Network moving industries forward',
        labelSq: 'Rrjet që lëviz industri',
      },
    ],
    storyEyebrowEn: 'FROM ICEBERG TO IX',
    storyEyebrowSq: 'NGA ICEBERG NË IX',
    storyTitleEn: 'We see platforms, not events.',
    storyTitleSq: 'Ne shohim platforma, jo thjesht evente.',
    storyBodyEn:
      "For years, we were known as Iceberg Exhibitions. Today, we are IX. The change reflects how our company has evolved — from standalone events to platforms that bring industries together, open new markets and support growth.\n\nEvery exhibition we create starts with a sector. Its challenges. Its opportunities. Its future. That focus has helped us build some of Albania's leading business events.",
    storyBodySq:
      'Për vite ishim të njohur si Iceberg Exhibitions. Sot jemi IX. Ndryshimi pasqyron evolucionin e kompanisë — nga evente të izoluara në platforma që bashkojnë industri, hapin tregje dhe mbështesin rritjen.\n\nÇdo panair që krijojmë nis nga një sektor. Sfida e tij. Mundësitë. E ardhmja. Ky fokus na ka ndihmuar të ndërtojmë disa nga eventet kryesore të biznesit në Shqipëri.',
    storyCtaEn: 'Read the full story',
    storyCtaSq: 'Lexo historinë e plotë',
    storyBadgeEn: 'Est. in Tirana',
    storyBadgeSq: 'Themeluar në Tiranë',
    cultureEyebrowEn: 'Our culture',
    cultureEyebrowSq: 'Kultura jonë',
    cultureTitleBeforeEn: 'Our business is built on',
    cultureTitleBeforeSq: 'Biznesi ynë ndërtohet mbi',
    cultureTitleAccentEn: 'relationships.',
    cultureTitleAccentSq: 'marrëdhënie.',
    cultureBodyEn:
      'The relationships we create for our clients. The relationships we build with our partners. And the relationships we build with each other. Different experiences, different strengths — one shared purpose.',
    cultureBodySq:
      'Marrëdhëniet që krijojmë për klientët. Marrëdhëniet me partnerët. Dhe marrëdhëniet midis nesh. Përvoja të ndryshme, forca të ndryshme — një qëllim i përbashkët.',
    cultureMeetTeamEn: 'Meet the team',
    cultureMeetTeamSq: 'Njih ekipin',
    cultureValues: [
      {
        titleEn: 'Industries Grow Through Connection',
        titleSq: 'Industritë rriten përmes lidhjes',
        bodyEn:
          'Progress happens when businesses, institutions and people come together around shared challenges and opportunities.',
        bodySq:
          'Progresi ndodh kur bizneset, institucionet dhe njerëzit bashkohen rreth sfidave dhe mundësive të përbashkëta.',
      },
      {
        titleEn: 'Expertise Creates Value',
        titleSq: 'Ekspertiza krijon vlerë',
        bodyEn:
          'We focus on sectors we understand, building platforms that respond to the real needs of the industries we serve.',
        bodySq:
          'Fokusohemi te sektorët që i kuptojmë, duke ndërtuar platforma që i përgjigjen nevojave reale.',
      },
      {
        titleEn: 'Growth Requires Exchange',
        titleSq: 'Rritja kërkon shkëmbim',
        bodyEn:
          'New ideas, knowledge and partnerships are the foundation of sustainable growth.',
        bodySq: 'Idetë e reja, njohuritë dhe partneritetet janë baza e rritjes së qëndrueshme.',
      },
      {
        titleEn: 'Evolution Never Stops',
        titleSq: 'Evolucioni nuk ndalet',
        bodyEn:
          'We continuously adapt, innovate and improve the way industries connect and do business.',
        bodySq: 'Përshtatemi, inovojmë dhe përmirësojmë vazhdimisht mënyrën si lidhen industritë.',
      },
      {
        titleEn: 'Relationships Matter',
        titleSq: 'Marrëdhëniet kanë rëndësi',
        bodyEn:
          'Long-term trust is at the heart of every event, partnership and community we build.',
        bodySq:
          'Besimi afatgjatë është në zemër të çdo eventi, partneriteti dhe komuniteti që ndërtojmë.',
      },
    ],
    missionTitleEn: 'Mission',
    missionTitleSq: 'Misioni',
    missionBodyEn:
      'To create platforms that bring industries together, encourage the exchange of knowledge and ideas, and support business growth.',
    missionBodySq:
      'Të krijojmë platforma që bashkojnë industri, nxisin shkëmbimin e njohurive dhe ideve, dhe mbështesin rritjen e biznesit.',
    team: [
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
    ],
    servicesEyebrowEn: 'Services',
    servicesEyebrowSq: 'Shërbimet',
    servicesHeadingEn: 'How we build industry platforms.',
    servicesHeadingSq: 'Si ndërtojmë platforma industrie.',
    services: [
      {
        titleEn: 'Trade Fair Development',
        titleSq: 'Zhvillim panairesh',
        bodyEn:
          'We create and develop industry-focused trade fairs that strengthen industries and connect markets — from concept to delivery.',
        bodySq:
          'Krijojmë panairë të fokusuara në industri që forcojnë sektorët dhe lidhin tregjet — nga koncepti te dorëzimi.',
        ctaEn: 'Explore Our Events',
        ctaSq: 'Eksploro eventet',
        ctaHref: '#events',
      },
      {
        titleEn: 'Business Matchmaking',
        titleSq: 'Business Matchmaking',
        bodyEn:
          'Curated B2B meetings, hosted buyer programmes and tailored agendas that unlock new market opportunities.',
        bodySq:
          'Takime B2B të kuruara, programe hosted buyer dhe agenda të përshtatura për mundësi të reja tregu.',
        ctaEn: 'Get in Touch',
        ctaSq: 'Na kontaktoni',
        ctaHref: '#contact',
      },
      {
        titleEn: 'Booth Design & Build',
        titleSq: 'Dizajn & ndërtim stendash',
        bodyEn:
          'Exhibition stands that combine creativity, functionality and brand impact — from concept to installation.',
        bodySq:
          'Stenda që kombinojnë kreativitet, funksionalitet dhe ndikim marke — nga koncepti te instalimi.',
        ctaEn: 'Get in Touch',
        ctaSq: 'Na kontaktoni',
        ctaHref: '#contact',
      },
    ],
    filmEyebrowEn: 'Watch the film',
    filmEyebrowSq: 'Shiko filmin',
    filmTitleEn: 'See what happens when an industry meets on an IX platform.',
    filmTitleSq: 'Shih çfarë ndodh kur një industri takohet në një platformë IX.',
    filmMetaEn: '3 min film',
    filmMetaSq: 'Film 3 min',
    filmUrl: 'https://www.youtube.com/watch?v=SDqORu5_Klk',
    newsEyebrowEn: 'News & media',
    newsEyebrowSq: 'Lajme & media',
    newsHeadingEn: "What's next on the calendar.",
    newsHeadingSq: 'Çfarë vjen në kalendar.',
    newsAllLabelEn: 'All news & media',
    newsAllLabelSq: 'Të gjitha lajmet & media',
    newsItems: [
      {
        categoryEn: 'Platform — Spring',
        categorySq: 'Platformë — Pranverë',
        titleEn: 'Tourism Fair Albania returns to Tirana',
        titleSq: 'Tourism Fair Albania kthehet në Tiranë',
        bodyEn: 'Hospitality leaders meet to open markets and shape the season ahead.',
        bodySq: 'Liderët e mikpritjes takohen për tregje të reja dhe sezonin që vjen.',
        href: 'https://tfa.i-exhibitions.com',
      },
      {
        categoryEn: 'Platform — 2024',
        categorySq: 'Platformë — 2024',
        titleEn: 'Future2Tech connects business and education',
        titleSq: 'Future2Tech lidh biznesin dhe arsimin',
        bodyEn: 'Innovation, emerging trends and the skills needed for tomorrow.',
        bodySq: 'Inovacion, trende dhe aftësitë e së nesërmes.',
        href: 'https://futuretotech.al',
      },
      {
        categoryEn: 'Platform — 2024',
        categorySq: 'Platformë — 2024',
        titleEn: 'Agriculture Days grows with the sector',
        titleSq: 'Agriculture Days rritet me sektorin',
        bodyEn: 'Knowledge exchange and innovation for a vital industry.',
        bodySq: 'Shkëmbim njohurish dhe inovacion për një industri jetike.',
        href: 'https://agridays.i-exhibitions.com',
      },
    ],
    videos: [
      {
        titleEn: '1st Edition — Agriculture Days',
        titleSq: '1st Edition — Agriculture Days',
        youtubeUrl: 'https://www.youtube.com/watch?v=PojaToTqsC8',
      },
      {
        titleEn: '1st Edition — Tourism Fair Albania',
        titleSq: '1st Edition — Tourism Fair Albania',
        youtubeUrl: 'https://www.youtube.com/watch?v=LBWWrAz0vCI',
      },
      {
        titleEn: '1st Edition — Energy, Construction & Green Economy',
        titleSq: '1st Edition — Energy, Construction & Green Economy',
        youtubeUrl: 'https://www.youtube.com/watch?v=SDqORu5_Klk',
      },
    ],
    ctaEyebrowEn: "Let's build something",
    ctaEyebrowSq: 'Le të ndërtojmë diçka',
    ctaTitleEn: 'Create the next platform for your industry.',
    ctaTitleSq: 'Krijoni platformën e ardhshme për industrinë tuaj.',
    ctaButtonEn: 'Start a conversation',
    ctaButtonSq: 'Fillo një bisedë',
    footerTaglineEn: 'I-Exhibitions — B2B exhibition platforms. Tirana, Albania.',
    footerTaglineSq: 'I-Exhibitions — Platforma B2B panairesh. Tiranë, Shqipëri.',
    footerExploreEn: 'Explore',
    footerExploreSq: 'Eksploro',
    footerPlatformsEn: 'Platforms',
    footerPlatformsSq: 'Platformat',
    footerConnectEn: 'Connect',
    footerConnectSq: 'Lidhu',
    copyrightEn: '© 2024 I-Exhibitions. All rights reserved.',
    copyrightSq: '© 2024 I-Exhibitions. Të gjitha të drejtat e rezervuara.',
    contactEmail: 'info@icebergexhibitions.com',
    contactPhone: '+355 69 406 3909',
    addressEn: 'Str. Tish Dahija, Kika 2, 6th Floor\nTirana, Albania',
    addressSq: 'Rr. Tish Dahija, Kika 2, kati 6\nTiranë, Shqipëri',
    instagram: 'https://www.instagram.com/ecge_fair',
    facebook: 'https://www.facebook.com/icebergexhibitions',
    linkedin: 'https://www.linkedin.com/company/iceberg-exhibitions/',
    youtube: 'https://www.youtube.com',
  }
}

/**
 * Fill the IX Main Site global with bilingual template copy so admin tabs are editable.
 * Skips when content already exists unless `force` is set.
 */
export async function seedMainSite(payload: Payload, options: SeedOptions = {}) {
  const existing = await payload.findGlobal({
    slug: 'main-site',
    depth: 0,
    overrideAccess: true,
  })

  if (!options.force && !isGlobalEmpty(existing as Record<string, unknown>)) {
    payload.logger.info('main-site global already has content — skip seed (pass force to overwrite)')
    return existing
  }

  const ecge = await payload.find({
    collection: 'microsites',
    where: { slug: { equals: 'ecge' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const ecgeId = ecge.docs[0]?.id

  const data = buildMainSiteSeedData(ecgeId)

  const updated = await payload.updateGlobal({
    slug: 'main-site',
    data,
    overrideAccess: true,
  })

  payload.logger.info('Seeded main-site global with IX template defaults')
  return updated
}
