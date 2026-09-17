import type { NextConfig } from 'next';

const isGithubPagesBuild = process.env.GITHUB_PAGES === 'true';
const repoName = 'danvar';
const basePath = isGithubPagesBuild ? `/${repoName}` : '';

const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isGithubPagesBuild
    ? {
        output: 'export',
        basePath,
        assetPrefix: `${basePath}/`,
        images: { unoptimized: true },
      }
    : {}),
};

export default config;
