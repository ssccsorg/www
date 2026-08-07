// @ts check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "SSCCS",
  tagline: "",
  url: "https://ssccs.org",
  baseUrl: "/",
  projectName: "SSCCS",
  onBrokenLinks: "warn",
  onBrokenAnchors: 'warn',       // Mitigating anchor (#) link errors

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themes: ["@docusaurus/theme-mermaid"],

  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    }
  },

  presets: [
    [
      "classic",
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"), // Enhanced path analysis safety
          remarkPlugins: [require("remark-math"), require("remark-gfm")],
          rehypePlugins: [require("rehype-katex")],
          routeBasePath: "/docs",
          exclude: ['**/_*/**'],
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
  ],

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
      type: "text/css",
      crossorigin: "anonymous",
    },
  ],

  themeConfig: {
    colorMode: {
      disableSwitch: true,
      defaultMode: 'light',
    },
    navbar: {
      title: "SSCCS",
      hideOnScroll: true,
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
      ],
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
    },
    zoom: {
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)'
      },
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
      options: { fontFamily: "arial", securityLevel: "loose" },
    },
  },
};

export default {
  ...config,
  plugins: [
    ...(config.plugins || []),
    function suppressNodeWarnings() {
      return {
        name: 'suppress-node-warnings',
        configureWebpack() {
          return {
            ignoreWarnings: [
              { module: /vscode-languageserver-types/ },
            ]
          };
        },
      };
    },
    function resolveNodePolyfills() {
      return {
        name: 'resolve-node-polyfills',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                assert: require.resolve('assert'),
                buffer: require.resolve('buffer'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                os: require.resolve('os-browserify'),
                path: require.resolve('path-browserify'),
                stream: require.resolve('stream-browserify'),
                url: require.resolve('url'),
                util: require.resolve('util'),
                zlib: require.resolve('browserify-zlib'),
                fs: false,
              },
            },
          };
        },
      };
    },
  ],
};