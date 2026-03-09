/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mkvmujibiwpobhszyeeg.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn-icons-png.flaticon.com',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    webpack: (config, { dev, isServer }) => {
        if (dev && !isServer) {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        return config;
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    }
                ],
            },
        ];
    },
};

module.exports = nextConfig;
