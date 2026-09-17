import type { NextConfig } from 'next';

const isGithubPagesBuild = process.env.GITHUB_PAGES === 'true';
const repoName = 'danvar';

const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  ...(isGithubPagesBuild
    ? {
        output: 'export',
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
        images: { unoptimized: true },
      }
    : {}),
};

export default config;
