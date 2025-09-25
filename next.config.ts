import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "40er1mqyxo.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
}

export default nextConfig
