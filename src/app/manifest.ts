import { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'AuraTune — Music for your mood',
    short_name: 'AuraTune',
    description: 'Discover new sounds and make a music library that feels like yours.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09080d',
    theme_color: '#09080d',
    orientation: 'portrait',
    scope: '/',
    categories: ['music', 'entertainment'],
    icons: [
      {
        src: '/icons/aura-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
    ],
  }
}
