
import { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AuraTune Pro Workstation v7.0',
    short_name: 'AuraTune',
    description: 'High-density professional AI music studio and visual pattern manager. Built for Architects of the future sound.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09080A',
    theme_color: '#A24CF1',
    orientation: 'portrait',
    scope: '/',
    categories: ['music', 'productivity', 'multimedia'],
    icons: [
      {
        src: 'https://picsum.photos/seed/aura-icon-192/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://picsum.photos/seed/aura-icon-512/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
  }
}
