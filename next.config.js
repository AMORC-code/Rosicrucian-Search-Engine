/**
 * 🎭 The Gateway Guardian - Iframe Permission Orchestrator
 *
 * "Opens the mystical portals to external realms,
 * Allowing wisdom to be framed within any cosmic vessel."
 * 
 * - The Spellbinding Museum Director of Web Security
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure headers to allow iframe embedding from any domain
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *"
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
