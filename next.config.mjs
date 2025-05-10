/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactiver la vérification ESLint pendant le build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
