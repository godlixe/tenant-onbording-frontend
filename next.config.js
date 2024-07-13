/** @type {import('next').NextConfig} */

const nextConfig = {
    assetPrefix: "/onboarding",
    images: {
        domains: [
            'images.unsplash.com',
            'portal.its.ac.id',
            'storage.googleapis.com',
            'encrypted-tbn0.gstatic.com',
            'cdn-icons-png.flaticon.com',
        ],
    },
    env: {
        "NEXT_PUBLIC_IAM_HOST": process.env.NEXT_PUBLIC_IAM_HOST,
        "NEXT_PUBLIC_BILLING_HOST": process.env.NEXT_PUBLIC_BILLING_HOST,
        "NEXT_PUBLIC_ONBOARDING_HOST": process.env.NEXT_PUBLIC_ONBOARDING_HOST,
        "INTEGRATED_MODE": process.env.INTEGRATED_MODE,
    },
    output: 'standalone'
};

module.exports = nextConfig;
