// next.config.js
// NOTE: Must be .js (not .ts) — Netlify's build pipeline does not transpile
// TypeScript config files. The old next.config.ts should be deleted.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do NOT set output: "standalone" on Netlify.
  // Netlify's OpenNext adapter handles its own output wrapping.
  // "standalone" causes the build artefact to be structured in a way
  // Netlify Functions cannot consume.

  images: {
    // next/image optimisation is handled by Netlify's image CDN at the edge.
    unoptimized: false,
  },

  // Expose public runtime env vars to the browser bundle.
  // Values must be set in the Netlify UI or netlify.toml [build.environment].
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
  },
};

module.exports = nextConfig;
