import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NethSecurity documentation',
  tagline:
    'NethSecurity is a Unified Threat Management solution based on OpenWrt',
  favicon: 'img/favicon.png',

  future: {
    v4: false,
  },

  // Served from a custom domain at the root (production:
  // https://docs.nethsecurity.org, fork testing: https://docs.gs.nethserver.net),
  // so baseUrl is '/'. Override the url via SITE_URL in CI if needed.
  url: process.env.SITE_URL ?? 'https://docs.nethsecurity.org',
  baseUrl: process.env.BASE_URL ?? '/',

  organizationName: process.env.GH_ORG ?? 'gsanchietti',
  projectName: 'nethsecurity-docs',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    // Treat .md as CommonMark and .mdx as MDX. The docs are converted from
    // reStructuredText and may contain bare angle brackets / braces that are
    // not valid MDX, so CommonMark parsing keeps the build robust.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
      it: {
        label: 'Italiano',
        direction: 'ltr',
        htmlLang: 'it-IT',
        calendar: 'gregory',
        path: 'it',
      },
    },
  },

  // Inject the kapa.ai AI assistant widget on every page.
  clientModules: ['./src/kapa.js'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/NethServer/nethsecurity-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'NethSecurity',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'administratorManualSidebar',
          position: 'left',
          label: 'Administrator manual',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/NethServer/nethsecurity-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Administrator manual',
              to: '/docs/administrator-manual',
            },
            {
              label: 'Tutorial',
              to: '/docs/tutorial',
            },
            {
              label: 'Developer manual',
              href: 'https://nethserver.github.io/nethsecurity/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'NethSecurity website',
              href: 'https://www.nethsecurity.org',
            },
            {
              label: 'NethServer Community',
              href: 'https://community.nethserver.org',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Package browser',
              href: 'pathname:///packages/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/NethServer/nethsecurity-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nethesis Srl and the NethSecurity project contributors`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Algolia DocSearch. Fill in apiKey/appId/indexName once provisioned.
    algolia: {
      appId: '10HTUTQ94F',
      apiKey: '1194366ce35a4f804c40fb58cea070dc',
      indexName: 'NethSecurity Docs',
      searchPagePath: 'search',
      insights: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
