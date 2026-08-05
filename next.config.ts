import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    position: "bottom-right",
  },
};

export default nextConfig;
