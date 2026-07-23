import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'We build platforms — recurring meeting points where entire industries come together to open markets, spark collaboration and grow.',
  images: [
    {
      url: `${getServerSideURL()}/ix/og-default.png`,
    },
  ],
  siteName: 'IX Exhibitions',
  title: 'IX Exhibitions — Industry platforms & trade fairs',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
