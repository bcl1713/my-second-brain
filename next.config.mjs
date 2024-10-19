import { createRequire } from "module";
const require = createRequire(import.meta.url);

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx'],
});
