/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Vercel deployment
  // Remove the line below if you need server-side features beyond static generation
  // output: 'export',

  // Enable image optimization
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
