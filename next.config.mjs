/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/sale",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
