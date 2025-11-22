/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/__/auth",
        destination: "https://great-exchange.firebaseapp.com/__/auth/",
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "d38v990enafbk6.cloudfront.net",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "greatexc-r2d9rlxct-ableez.vercel.app",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "greatexchange.co",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "store.storeimages.cdn-apple.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "greatexc-r2d9rlxct-ableez.vercel.app",
        pathname: "**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "**",
        port: "",
      },
    ],
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((loader) => {
            if (
              loader.use &&
              loader.use.length > 0 &&
              loader.use[0].options &&
              loader.use[0].options.postcssOptions
            ) {
              loader.use[0].options.postcssOptions.plugins.unshift(
                "postcss-nesting"
              );
            }
          });
        }
      });
    }

    return config;
  },
  env: {
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  },
  crossOrigin: "anonymous",
};

module.exports = nextConfig;
