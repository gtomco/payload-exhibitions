type JsonLd = Record<string, unknown>

export function jsonLdScript(data: JsonLd | JsonLd[]) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  }
}

export function organizationJsonLd(args: {
  name: string
  url: string
  description?: string | null
  email?: string | null
  telephone?: string | null
  address?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: args.name,
    url: args.url,
    description: args.description || undefined,
    email: args.email || undefined,
    telephone: args.telephone || undefined,
    address: args.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: args.address,
        }
      : undefined,
  } satisfies JsonLd
}

export function webPageJsonLd(args: {
  name: string
  url: string
  description?: string | null
  inLanguage?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: args.name,
    url: args.url,
    description: args.description || undefined,
    inLanguage: args.inLanguage || undefined,
  } satisfies JsonLd
}

export function breadcrumbJsonLd(args: { items: Array<{ name: string; url: string }> }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: args.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } satisfies JsonLd
}

export function eventJsonLd(args: {
  name: string
  url: string
  description?: string | null
  startDate?: string | null
  endDate?: string | null
  locationName?: string | null
  image?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: args.name,
    url: args.url,
    description: args.description || undefined,
    startDate: args.startDate || undefined,
    endDate: args.endDate || undefined,
    image: args.image || undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: args.locationName
      ? {
          '@type': 'Place',
          name: args.locationName,
        }
      : undefined,
  } satisfies JsonLd
}

export function newsArticleJsonLd(args: {
  headline: string
  url: string
  description?: string | null
  datePublished?: string | null
  dateModified?: string | null
  image?: string | null
  authorName?: string | null
  publisherName?: string
  publisherUrl?: string
  inLanguage?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: args.headline,
    url: args.url,
    mainEntityOfPage: args.url,
    description: args.description || undefined,
    datePublished: args.datePublished || undefined,
    dateModified: args.dateModified || args.datePublished || undefined,
    image: args.image || undefined,
    inLanguage: args.inLanguage || undefined,
    author: args.authorName
      ? {
          '@type': 'Person',
          name: args.authorName,
        }
      : undefined,
    publisher: args.publisherName
      ? {
          '@type': 'Organization',
          name: args.publisherName,
          url: args.publisherUrl || undefined,
        }
      : undefined,
  } satisfies JsonLd
}
