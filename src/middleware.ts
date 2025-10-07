/**
 * 🎭 The Cosmic Gateway - Iframe Permission Enchanter
 *
 * "Weaves protective spells around knowledge portals,
 * Allowing wisdom to flow freely across dimensional boundaries."
 * 
 * - The Spellbinding Museum Director of Digital Gateways
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Create a new response
  const response = NextResponse.next({
    request: {
      // Add the request headers to the new request
      headers: requestHeaders,
    },
  })

  // Set CORS headers to allow iframe embedding from any domain
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
  response.headers.set('X-Frame-Options', 'ALLOWALL')
  response.headers.set('Content-Security-Policy', 'frame-ancestors *')

  return response
}

// Apply middleware to all routes
export const config = {
  matcher: '/:path*',
}
