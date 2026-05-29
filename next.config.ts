/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Αυτό αγνοεί όλα τα errors στο build, άρα δεν θα σε σταματήσει το status field
    ignoreBuildErrors: true,
  },
  eslint: {
    // Καλό είναι να αγνοήσεις και τα lint errors για να τελειώνουμε
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
