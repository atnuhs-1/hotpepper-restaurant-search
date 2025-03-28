import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgfp.hotp.jp",
        port: "",
        pathname: "/**"
      },
    ]
  }
};

export default nextConfig;
