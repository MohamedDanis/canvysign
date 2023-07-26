/** @type {import('next').NextConfig} */
const nextConfig = {
    //adding image domains to nextjs
    images: {
        domains: ['canvisign.s3.ap-southeast-2.amazonaws.com', 'localhost'],
    },
}

module.exports = nextConfig
