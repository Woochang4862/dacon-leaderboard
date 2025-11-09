const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = "dacon-leaderboard";
const basePath = isGithubActions ? `/${repositoryName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

