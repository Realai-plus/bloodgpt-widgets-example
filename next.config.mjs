/** @type {import('next').NextConfig} */
const nextConfig = {
  // The published @bloodgpt/widgets bundle inlines react-markdown/remark-gfm,
  // whose `vfile` dependency statically imports node builtins (`path`, `url`,
  // `process`). Those code paths never run in the browser (react-markdown is
  // fed plain strings, never file paths), but webpack still needs to resolve
  // the imports for the client bundle. `path`/`url` are stubbed to empty
  // modules; `process` resolves to the installed `process` browser shim so
  // `process.cwd()` returns a harmless "/".
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      url: false,
    };
    return config;
  },
};

export default nextConfig;
