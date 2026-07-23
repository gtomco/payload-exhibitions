import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { PublicLang } from '@/microsite/constants'
import {
  defaultIxContent,
  IX_DEFAULT_THEME,
  type IxMainContent,
  type IxPlatformLink,
} from '@/main-site/defaults'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getRootDomain, micrositeOrigin } from '@/utilities/publicUrls'

function mediaUrl(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  const url = (value as { url?: string | null }).url
  return url ? getMediaUrl(url) : null
}

function pick(
  sq: boolean,
  en: string | null | undefined,
  sqVal: string | null | undefined,
  fallback: string,
) {
  return (sq ? sqVal : en) || en || fallback
}

function youtubeThumb(url: string): string | null {
  try {
    const u = new URL(url)
    const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop()
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
  } catch {
    return null
  }
}

const loadMainSiteDoc = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'main-site', depth: 1 })
  },
  ['main-site-global'],
  { tags: ['global_main-site'], revalidate: 60 },
)

export const getMainSiteContent = cache(async (lang: PublicLang): Promise<IxMainContent> => {
  const fallback = defaultIxContent(lang)
  try {
    const doc = await loadMainSiteDoc()
    if (!doc) return fallback

    const sq = lang === 'sq'
    const theme = {
      black: doc.theme?.black || IX_DEFAULT_THEME.black,
      white: doc.theme?.white || IX_DEFAULT_THEME.white,
      accent: doc.theme?.accent || IX_DEFAULT_THEME.accent,
      grey: doc.theme?.grey || IX_DEFAULT_THEME.grey,
      soft: doc.theme?.soft || IX_DEFAULT_THEME.soft,
      film: doc.theme?.film || IX_DEFAULT_THEME.film,
      muted: doc.theme?.muted || IX_DEFAULT_THEME.muted,
    }

    const platforms: IxPlatformLink[] = (doc.platforms || []).map((p) => {
      const microsite = p.microsite && typeof p.microsite === 'object' ? p.microsite : null
      const slug = microsite?.slug
      const productionUrl = microsite?.productionUrl
      let href = '#'
      let external = false
      if (p.linkType === 'external' && p.externalUrl) {
        href = p.externalUrl
        external = true
      } else if (slug) {
        const derived = getRootDomain() ? micrositeOrigin(slug) : null
        if (process.env.NODE_ENV === 'production' && (productionUrl || derived)) {
          href = productionUrl || derived || `/m/${slug}`
          external = Boolean(productionUrl || derived)
        } else {
          href = `/m/${slug}`
          external = false
        }
      }
      return {
        title: pick(sq, p.titleEn, p.titleSq, ''),
        subtitle: pick(sq, p.subtitleEn, p.subtitleSq, ''),
        blurb: pick(sq, p.blurbEn, p.blurbSq, ''),
        href,
        external,
        tickerLabel: p.tickerLabel || '',
        logoUrl: mediaUrl(p.logo),
      }
    })

    return {
      theme,
      seoTitle: pick(sq, (doc as { seoTitleEn?: string }).seoTitleEn, (doc as { seoTitleSq?: string }).seoTitleSq, fallback.seoTitle),
      seoDescription: pick(
        sq,
        (doc as { seoDescriptionEn?: string }).seoDescriptionEn,
        (doc as { seoDescriptionSq?: string }).seoDescriptionSq,
        fallback.seoDescription,
      ),
      nav: {
        about: pick(sq, doc.navAboutEn, doc.navAboutSq, fallback.nav.about),
        events: pick(sq, doc.navEventsEn, doc.navEventsSq, fallback.nav.events),
        culture: pick(sq, doc.navCultureEn, doc.navCultureSq, fallback.nav.culture),
        news: pick(sq, doc.navNewsEn, doc.navNewsSq, fallback.nav.news),
        contact: pick(sq, doc.navContactEn, doc.navContactSq, fallback.nav.contact),
      },
      heroEyebrow: pick(sq, doc.heroEyebrowEn, doc.heroEyebrowSq, fallback.heroEyebrow),
      heroTitle: pick(sq, doc.heroTitleEn, doc.heroTitleSq, fallback.heroTitle),
      heroBrand: pick(sq, doc.heroBrandEn, doc.heroBrandSq, fallback.heroBrand),
      heroBody: pick(sq, doc.heroBodyEn, doc.heroBodySq, fallback.heroBody),
      heroCtaPrimary: pick(sq, doc.heroCtaPrimaryEn, doc.heroCtaPrimarySq, fallback.heroCtaPrimary),
      heroCtaSecondary: pick(
        sq,
        doc.heroCtaSecondaryEn,
        doc.heroCtaSecondarySq,
        fallback.heroCtaSecondary,
      ),
      heroCaption: pick(sq, doc.heroCaptionEn, doc.heroCaptionSq, fallback.heroCaption),
      heroImageUrl: mediaUrl(doc.heroImage) || fallback.heroImageUrl,
      platformsEyebrow: pick(
        sq,
        doc.platformsEyebrowEn,
        doc.platformsEyebrowSq,
        fallback.platformsEyebrow,
      ),
      platformsHeading: pick(
        sq,
        doc.platformsHeadingEn,
        doc.platformsHeadingSq,
        fallback.platformsHeading,
      ),
      platformsIntro: pick(sq, doc.platformsIntroEn, doc.platformsIntroSq, fallback.platformsIntro),
      platformsSeeAll: pick(
        sq,
        doc.platformsSeeAllEn,
        doc.platformsSeeAllSq,
        fallback.platformsSeeAll,
      ),
      platforms: platforms.length ? platforms : fallback.platforms,
      stats: (doc.stats || []).length
        ? (doc.stats || []).map((s) => ({
            value: s.value || '',
            label: pick(sq, s.labelEn, s.labelSq, ''),
          }))
        : fallback.stats,
      storyEyebrow: pick(sq, doc.storyEyebrowEn, doc.storyEyebrowSq, fallback.storyEyebrow),
      storyTitle: pick(sq, doc.storyTitleEn, doc.storyTitleSq, fallback.storyTitle),
      storyBody: pick(sq, doc.storyBodyEn, doc.storyBodySq, fallback.storyBody),
      storyCta: pick(sq, doc.storyCtaEn, doc.storyCtaSq, fallback.storyCta),
      storyBadge: pick(sq, doc.storyBadgeEn, doc.storyBadgeSq, fallback.storyBadge),
      storyImageUrl: mediaUrl(doc.storyImage) || fallback.storyImageUrl,
      cultureEyebrow: pick(sq, doc.cultureEyebrowEn, doc.cultureEyebrowSq, fallback.cultureEyebrow),
      cultureTitleBefore: pick(
        sq,
        doc.cultureTitleBeforeEn,
        doc.cultureTitleBeforeSq,
        fallback.cultureTitleBefore,
      ),
      cultureTitleAccent: pick(
        sq,
        doc.cultureTitleAccentEn,
        doc.cultureTitleAccentSq,
        fallback.cultureTitleAccent,
      ),
      cultureBody: pick(sq, doc.cultureBodyEn, doc.cultureBodySq, fallback.cultureBody),
      cultureMeetTeam: pick(
        sq,
        doc.cultureMeetTeamEn,
        doc.cultureMeetTeamSq,
        fallback.cultureMeetTeam,
      ),
      cultureValues: (doc.cultureValues || []).length
        ? (doc.cultureValues || []).map((v) => ({
            title: pick(sq, v.titleEn, v.titleSq, ''),
            body: pick(sq, v.bodyEn, v.bodySq, ''),
          }))
        : fallback.cultureValues,
      missionTitle: pick(sq, doc.missionTitleEn, doc.missionTitleSq, fallback.missionTitle),
      missionBody: pick(sq, doc.missionBodyEn, doc.missionBodySq, fallback.missionBody),
      team: (doc.team || []).length
        ? (doc.team || []).map((m) => ({
            name: m.name || '',
            role: pick(sq, m.roleEn, m.roleSq, ''),
            initials: m.initials || (m.name || '').slice(0, 2).toUpperCase(),
            photoUrl: mediaUrl(m.photo),
          }))
        : fallback.team,
      servicesEyebrow: pick(
        sq,
        doc.servicesEyebrowEn,
        doc.servicesEyebrowSq,
        fallback.servicesEyebrow,
      ),
      servicesHeading: pick(
        sq,
        doc.servicesHeadingEn,
        doc.servicesHeadingSq,
        fallback.servicesHeading,
      ),
      services: (doc.services || []).length
        ? (doc.services || []).map((s) => ({
            title: pick(sq, s.titleEn, s.titleSq, ''),
            body: pick(sq, s.bodyEn, s.bodySq, ''),
            cta: pick(sq, s.ctaEn, s.ctaSq, ''),
            href: s.ctaHref || '#contact',
          }))
        : fallback.services,
      filmEyebrow: pick(sq, doc.filmEyebrowEn, doc.filmEyebrowSq, fallback.filmEyebrow),
      filmTitle: pick(sq, doc.filmTitleEn, doc.filmTitleSq, fallback.filmTitle),
      filmMeta: pick(sq, doc.filmMetaEn, doc.filmMetaSq, fallback.filmMeta),
      filmUrl: doc.filmUrl || fallback.filmUrl,
      newsEyebrow: pick(sq, doc.newsEyebrowEn, doc.newsEyebrowSq, fallback.newsEyebrow),
      newsHeading: pick(sq, doc.newsHeadingEn, doc.newsHeadingSq, fallback.newsHeading),
      newsAllLabel: pick(sq, doc.newsAllLabelEn, doc.newsAllLabelSq, fallback.newsAllLabel),
      newsItems: (doc.newsItems || []).length
        ? (doc.newsItems || []).map((n) => ({
            category: pick(sq, n.categoryEn, n.categorySq, ''),
            title: pick(sq, n.titleEn, n.titleSq, ''),
            body: pick(sq, n.bodyEn, n.bodySq, ''),
            imageUrl: mediaUrl(n.image) || fallback.newsItems[0]?.imageUrl || '/ix/news-ref.png',
            href: n.href || undefined,
          }))
        : fallback.newsItems,
      videos: (doc.videos || []).length
        ? (doc.videos || []).map((v) => ({
            title: pick(sq, v.titleEn, v.titleSq, ''),
            youtubeUrl: v.youtubeUrl || '',
            coverUrl: mediaUrl(v.cover) || youtubeThumb(v.youtubeUrl || ''),
          }))
        : fallback.videos.map((v) => ({
            ...v,
            coverUrl: youtubeThumb(v.youtubeUrl),
          })),
      ctaEyebrow: pick(sq, doc.ctaEyebrowEn, doc.ctaEyebrowSq, fallback.ctaEyebrow),
      ctaTitle: pick(sq, doc.ctaTitleEn, doc.ctaTitleSq, fallback.ctaTitle),
      ctaButton: pick(sq, doc.ctaButtonEn, doc.ctaButtonSq, fallback.ctaButton),
      footerTagline: pick(sq, doc.footerTaglineEn, doc.footerTaglineSq, fallback.footerTagline),
      footerExplore: pick(sq, doc.footerExploreEn, doc.footerExploreSq, fallback.footerExplore),
      footerPlatforms: pick(
        sq,
        doc.footerPlatformsEn,
        doc.footerPlatformsSq,
        fallback.footerPlatforms,
      ),
      footerConnect: pick(sq, doc.footerConnectEn, doc.footerConnectSq, fallback.footerConnect),
      copyright: pick(sq, doc.copyrightEn, doc.copyrightSq, fallback.copyright),
      contactEmail: doc.contactEmail || fallback.contactEmail,
      contactPhone: doc.contactPhone || fallback.contactPhone,
      address: pick(sq, doc.addressEn, doc.addressSq, fallback.address),
      social: {
        instagram: doc.instagram || fallback.social.instagram,
        facebook: doc.facebook || fallback.social.facebook,
        linkedin: doc.linkedin || fallback.social.linkedin,
        youtube: doc.youtube || fallback.social.youtube,
      },
    }
  } catch {
    return fallback
  }
})
